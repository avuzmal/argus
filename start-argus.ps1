Write-Host "Starting Argus Real-Time Data Pipeline..." -ForegroundColor Green

# 1. Start Infrastructure
Write-Host "Starting Docker Infrastructure..." -ForegroundColor Cyan
docker-compose up -d

# Wait a moment for infrastructure to boot
Start-Sleep -Seconds 5

# 2. Start Frontend
Write-Host "Starting Next.js Frontend Dashboard (Port 3005)..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit -Command `"cd frontend; npm run dev`"" -WindowStyle Normal

# 3. Start Backend Services using Poetry
Write-Host "Starting FastAPI Ingestion Service (Port 8000)..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit -Command `"cd backend; poetry run uvicorn ingestion.main:app --host 0.0.0.0 --port 8000 --reload`"" -WindowStyle Normal

Write-Host "Starting FastAPI WebSocket Gateway (Port 8001)..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit -Command `"cd backend; poetry run uvicorn api_gateway.main:app --host 0.0.0.0 --port 8001 --reload`"" -WindowStyle Normal

# Wait for APIs and Kafka to be fully ready before starting stream processors and simulator
Write-Host "Waiting for APIs and Kafka to initialize..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

Write-Host "Starting Bytewax Stream Processor & ML Engine..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit -Command `"cd backend; poetry run python -m processor.main`"" -WindowStyle Normal

Write-Host "Starting Nexus Manufacturing Data Simulator..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit -Command `"cd backend; poetry run python -m simulator.main`"" -WindowStyle Normal

Write-Host "All components started! Dashboard available at http://localhost:3005" -ForegroundColor Green
