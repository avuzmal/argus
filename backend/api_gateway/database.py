from sqlalchemy import create_engine, Column, String, Float, Boolean, JSON
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy.dialects.postgresql import UUID, TIMESTAMP
import uuid
import os

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:postgres@localhost:5432/argus")

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class SensorReading(Base):
    __tablename__ = "sensor_readings"
    
    time = Column(TIMESTAMP(timezone=True), primary_key=True, index=True)
    sensor_id = Column(String, primary_key=True, index=True)
    value = Column(Float, nullable=False)
    metadata_ = Column("metadata", JSON)

class Alert(Base):
    __tablename__ = "alerts"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    time = Column(TIMESTAMP(timezone=True), nullable=False, index=True)
    sensor_id = Column(String, nullable=False, index=True)
    severity = Column(String, nullable=False)
    message = Column(String, nullable=False)
    acknowledged = Column(Boolean, default=False)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
