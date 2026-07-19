import redis.asyncio as redis
import time
from fastapi import HTTPException
from ..core.config import settings

redis_client = redis.from_url(settings.REDIS_URL, encoding="utf-8", decode_responses=True)

class RateLimiter:
    def __init__(self, requests: int, window: int):
        self.requests = requests
        self.window = window

    async def check_rate_limit(self, key: str):
        redis_key = f"rate_limit:{key}"
        current_time = int(time.time())
        window_start = current_time - self.window

        pipeline = redis_client.pipeline()
        # Remove old requests
        pipeline.zremrangebyscore(redis_key, 0, window_start)
        # Count requests in current window
        pipeline.zcard(redis_key)
        # Add current request
        pipeline.zadd(redis_key, {str(current_time): current_time})
        # Set expire for cleanup
        pipeline.expire(redis_key, self.window)
        
        results = await pipeline.execute()
        request_count = results[1]

        if request_count >= self.requests:
            raise HTTPException(
                status_code=429,
                detail="Rate limit exceeded"
            )

# 100 requests per minute
api_key_rate_limiter = RateLimiter(requests=100, window=60)
