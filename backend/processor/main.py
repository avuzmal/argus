from bytewax.dataflow import Dataflow
from bytewax.connectors.kafka import KafkaSource, KafkaSink, KafkaSinkMessage
from bytewax.window import TumblingWindow, SystemClockConfig
from datetime import timedelta
import json
import numpy as np

from .ml.models.isolation_forest import MLDetector

# Initialize the ML Detector
ml_detector = MLDetector()

def extract_sensor_data(kafka_message):
    # Kafka message comes as (key, value)
    key, value = kafka_message
    if value is None:
        return None
    # Assuming value is already deserialized from Avro for simplicity in this snippet, 
    # but in a real implementation we would deserialize here.
    # For now, let's treat it as a JSON string to keep Bytewax simple
    try:
        data = json.loads(value)
        sensor_id = data.get("sensor_id")
        return (sensor_id, data)
    except Exception:
        return None

def calculate_window_features(key_and_events):
    sensor_id, events = key_and_events
    values = [e["value"] for e in events]
    
    features = {
        "mean": np.mean(values),
        "std": np.std(values) if len(values) > 1 else 0,
        "max": np.max(values),
        "min": np.min(values),
        "count": len(values),
        "last_timestamp": events[-1]["timestamp"]
    }
    
    # Run anomaly detection
    is_anomaly, score = ml_detector.predict(features)
    
    if is_anomaly:
        alert = {
            "sensor_id": sensor_id,
            "severity": "CRITICAL" if score < -0.5 else "WARNING",
            "score": score,
            "timestamp": features["last_timestamp"],
            "message": f"Anomaly detected with score {score:.2f} (mean: {features['mean']:.2f})"
        }
        return (sensor_id, alert)
    return None

# Create the Bytewax dataflow
flow = Dataflow("argus_anomaly_detector")

# Source: Read from Kafka
flow.input(
    "kafka_in",
    KafkaSource(
        brokers=["localhost:9092"],
        topics=["sensor-readings"],
        tail=False,
    )
)

# Extract key (sensor_id) and value
flow.map("extract", extract_sensor_data)
flow.filter("remove_nulls", lambda x: x is not None)

# Windowing: Tumbling 10-second windows based on system clock
# Note: Bytewax windowing uses stateful operators
flow.reduce_window(
    "10s_tumbling",
    SystemClockConfig(),
    TumblingWindow(length=timedelta(seconds=10)),
    lambda a, b: a + [b] if isinstance(a, list) else [a, b]
)

# Calculate features and detect anomalies
flow.map("detect_anomalies", calculate_window_features)
flow.filter("keep_anomalies", lambda x: x is not None)

# Format for Kafka sink
def format_kafka_sink(key_and_alert):
    sensor_id, alert = key_and_alert
    return KafkaSinkMessage(
        key=sensor_id.encode(),
        value=json.dumps(alert).encode()
    )

flow.map("format_sink", format_kafka_sink)

# Sink: Write anomalies to alerts topic
flow.output(
    "kafka_out",
    KafkaSink(
        brokers=["localhost:9092"],
        topic="alert-events"
    )
)
