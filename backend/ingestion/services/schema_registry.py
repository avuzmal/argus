import json
from fastavro import parse_schema, schemacontext, parse_schema, json_writer, json_reader, writer
import io
import os
from ..core.config import settings
from ..core.logging import logger

class SchemaRegistryService:
    def __init__(self):
        self.schemas = {}
        self.load_schemas()

    def load_schemas(self):
        # In a real enterprise setup, this would fetch from Confluent Schema Registry
        # For simplicity and offline dev, we load from local avsc files
        schema_dir = os.path.join(os.path.dirname(__file__), "../../../schemas/avro")
        try:
            with open(os.path.join(schema_dir, "sensor_reading.avsc"), "r") as f:
                schema_json = json.load(f)
                self.schemas["sensor-reading"] = parse_schema(schema_json)
            logger.info("Loaded Avro schemas successfully")
        except Exception as e:
            logger.error(f"Failed to load Avro schemas: {e}")

    async def encode(self, subject: str, record: dict) -> bytes:
        if subject not in self.schemas:
            raise ValueError(f"Schema not found for subject: {subject}")
            
        schema = self.schemas[subject]
        bytes_writer = io.BytesIO()
        writer(bytes_writer, schema, [record])
        return bytes_writer.getvalue()

schema_registry = SchemaRegistryService()
