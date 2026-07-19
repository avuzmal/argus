from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import List, Union
from pydantic import AnyHttpUrl, validator

class Settings(BaseSettings):
    PROJECT_NAME: str = "Argus"
    API_V1_STR: str = "/api/v1"
    
    # CORS
    BACKEND_CORS_ORIGINS: List[AnyHttpUrl] = ["http://localhost:3000"]
    
    @validator("BACKEND_CORS_ORIGINS", pre=True)
    def assemble_cors_origins(cls, v: Union[str, List[str]]) -> Union[List[str], str]:
        if isinstance(v, str) and not v.startswith("["):
            return [i.strip() for i in v.split(",")]
        elif isinstance(v, (list, str)):
            return v
        raise ValueError(v)

    # Kafka Configuration
    KAFKA_BOOTSTRAP_SERVERS: str = "localhost:9092"
    SCHEMA_REGISTRY_URL: str = "http://localhost:8081"
    
    # Redis Configuration
    REDIS_URL: str = "redis://localhost:6379/0"
    
    # API Security
    API_KEY_HEADER: str = "X-API-Key"
    VALID_API_KEYS: List[str] = ["test-key-123"] # In production, load from Vault/Secrets Manager
    
    model_config = SettingsConfigDict(case_sensitive=True, env_file=".env")

settings = Settings()
