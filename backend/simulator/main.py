import asyncio
import aiohttp
import time
from .generators.nexus_manufacturing import NexusManufacturingSimulator
from ..ingestion.core.logging import logger

async def run_simulator(rate: int = 100):
    simulator = NexusManufacturingSimulator(num_sensors=200)
    
    async with aiohttp.ClientSession() as session:
        headers = {"X-API-Key": "test-key-123"}
        url = "http://localhost:8000/api/v1/ingest/sensor"
        
        logger.info(f"Starting Nexus Manufacturing Simulator at {rate} events/sec")
        
        while True:
            start_time = time.time()
            tasks = []
            
            # Generate events
            events = simulator.generate_batch(rate)
            
            # Send events concurrently
            for event in events:
                tasks.append(
                    session.post(url, json=event, headers=headers)
                )
            
            results = await asyncio.gather(*tasks, return_exceptions=True)
            
            # Log errors
            for i, result in enumerate(results):
                if isinstance(result, Exception):
                    logger.error(f"Failed to send event: {result}")
                elif result.status != 201:
                    logger.error(f"Event rejected with status {result.status}")
            
            # Sleep to maintain rate
            elapsed = time.time() - start_time
            if elapsed < 1.0:
                await asyncio.sleep(1.0 - elapsed)
            else:
                logger.warning(f"Simulator falling behind! Batch took {elapsed}s")

if __name__ == "__main__":
    asyncio.run(run_simulator(rate=100))
