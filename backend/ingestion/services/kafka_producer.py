import asyncio
from confluent_kafka import Producer
from confluent_kafka.admin import AdminClient, NewTopic
from ..core.config import settings
from ..core.logging import logger

class KafkaProducerService:
    def __init__(self):
        self.producer = None
        self.admin = None

    def connect(self):
        conf = {
            'bootstrap.servers': settings.KAFKA_BOOTSTRAP_SERVERS,
            'client.id': 'argus-ingestion-api',
            'linger.ms': 5, # batching
            'compression.type': 'lz4',
        }
        self.producer = Producer(conf)
        self.admin = AdminClient({'bootstrap.servers': settings.KAFKA_BOOTSTRAP_SERVERS})
        logger.info("Kafka Producer connected")
        
        self.create_topic_if_not_exists("sensor-readings")

    def create_topic_if_not_exists(self, topic_name: str):
        try:
            topics = self.admin.list_topics(timeout=10).topics
            if topic_name not in topics:
                new_topic = NewTopic(
                    topic=topic_name, 
                    num_partitions=12, 
                    replication_factor=1
                )
                fs = self.admin.create_topics([new_topic])
                for topic, f in fs.items():
                    try:
                        f.result()  # The result itself is None
                        logger.info(f"Topic {topic} created")
                    except Exception as e:
                        logger.error(f"Failed to create topic {topic}: {e}")
        except Exception as e:
            logger.error(f"Failed to check/create topic {topic_name}: {e}")

    async def send_and_wait(self, topic: str, key: bytes, value: bytes, headers: list = None):
        loop = asyncio.get_running_loop()
        future = loop.create_future()

        def delivery_report(err, msg):
            if err is not None:
                loop.call_soon_threadsafe(future.set_exception, Exception(f"Message delivery failed: {err}"))
            else:
                loop.call_soon_threadsafe(future.set_result, msg)

        self.producer.produce(
            topic=topic,
            key=key,
            value=value,
            headers=headers,
            on_delivery=delivery_report
        )
        self.producer.poll(0)
        return await future

    def flush(self):
        if self.producer:
            self.producer.flush()

kafka_producer = KafkaProducerService()
