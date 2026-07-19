import random
import time
from datetime import datetime
from typing import List, Dict

class NexusManufacturingSimulator:
    def __init__(self, num_sensors: int = 200):
        self.num_sensors = num_sensors
        self.sensors = self._init_sensors()
        
    def _init_sensors(self) -> List[Dict]:
        sensors = []
        types = [
            ("TEMP", 45, 85, "C"),
            ("VIBRATION", 10, 200, "Hz"),
            ("PRESSURE", 80, 150, "PSI"),
            ("POWER", 500, 2500, "kW")
        ]
        
        for i in range(self.num_sensors):
            s_type, min_val, max_val, unit = random.choice(types)
            sensors.append({
                "sensor_id": f"MCH-{i:03d}-{s_type}",
                "sensor_type": s_type,
                "min_val": min_val,
                "max_val": max_val,
                "unit": unit,
                "current_val": random.uniform(min_val, max_val),
                "trend": random.choice([-1, 1]) * random.uniform(0.1, 0.5)
            })
        return sensors
        
    def generate_batch(self, count: int) -> List[Dict]:
        events = []
        timestamp = datetime.utcnow().isoformat() + "Z"
        
        # Select random subset to update
        update_sensors = random.sample(self.sensors, min(count, len(self.sensors)))
        
        for sensor in update_sensors:
            # Random walk
            sensor["current_val"] += sensor["trend"] + random.uniform(-1, 1)
            
            # Revert if out of bounds (unless anomaly)
            if sensor["current_val"] > sensor["max_val"]:
                sensor["trend"] = -abs(sensor["trend"])
            elif sensor["current_val"] < sensor["min_val"]:
                sensor["trend"] = abs(sensor["trend"])
                
            # Randomly flip trend
            if random.random() < 0.05:
                sensor["trend"] *= -1
                
            # Random anomalies (1% chance)
            val = sensor["current_val"]
            if random.random() < 0.01:
                val = val * random.uniform(1.5, 3.0) # Spike
                
            events.append({
                "sensor_id": sensor["sensor_id"],
                "sensor_type": sensor["sensor_type"],
                "value": round(val, 2),
                "timestamp": timestamp,
                "metadata": {
                    "unit": sensor["unit"],
                    "location": f"Zone-{random.randint(1, 10)}"
                }
            })
            
        return events
