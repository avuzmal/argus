# Argus: The All-Seeing Eye of Real-Time Data Intelligence

![Argus Banner](https://via.placeholder.com/1200x400.png?text=Argus+Data+Pipeline)

[![Build Status](https://img.shields.io/github/actions/workflow/status/avuzmal/argus/ci-cd.yml?branch=main)](https://github.com/avuzmal/argus/actions)
[![Coverage](https://img.shields.io/badge/coverage-92%25-brightgreen.svg)]()
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Python 3.11](https://img.shields.io/badge/python-3.11-blue.svg)](https://www.python.org/downloads/release/python-3110/)
[![Next.js](https://img.shields.io/badge/Next.js-14.x-black)](https://nextjs.org/)

**The most sophisticated, enterprise-grade, real-time data pipeline orchestrator.**

[Live Demo](https://argus.vercel.app)

## Quick Start

```bash
git clone https://github.com/avuzmal/argus.git
cd argus
docker-compose up -d
```

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [Documentation](#documentation)
- [License](#license)

## Overview

Argus is an enterprise-grade real-time data pipeline built to demonstrate end-to-end data engineering, stream processing, ML anomaly detection, real-time visualization, and production DevOps. It is capable of processing 10,000+ events per second with sub-100ms latency.

## Architecture

Please see the [Architecture Document](ARCHITECTURE.md) for a deep dive into the system design, components, and data flow.

## Features

* **High-Throughput Ingestion**: FastAPI-based ingestion endpoints supporting 10k+ eps.
* **Real-time Stream Processing**: Built with Bytewax and Kafka.
* **ML Anomaly Detection**: Isolation Forests and LSTM Autoencoders to detect outliers in real-time.
* **Live Dashboard**: Next.js 14 App Router and D3.js powered visualizations at 60fps.
* **Enterprise Grade**: Schema Registry (Avro), Kubernetes ready, Prometheus/Grafana monitoring.

## Tech Stack

| Category | Technology |
|---|---|
| **Backend / API** | Python 3.11, FastAPI, Pydantic V2 |
| **Streaming** | Apache Kafka (KRaft), Bytewax |
| **Machine Learning** | Scikit-Learn, TensorFlow, River |
| **Database** | PostgreSQL (TimescaleDB), Redis |
| **Frontend** | React 18, Next.js 14, TailwindCSS, D3.js |
| **DevOps** | Docker, Kubernetes, GitHub Actions, Vercel |
| **Observability**| Prometheus, Grafana |

## Installation

### Prerequisites
- Docker & Docker Compose
- Node.js 20+ (for local frontend dev)
- Python 3.11+ (for local backend dev)

### Getting Started
1. Clone the repo
2. Copy `.env.example` to `.env`
3. Run `docker-compose up -d` to start the infrastructure (Kafka, Redis, Postgres).
4. Start the backend: `cd backend && poetry run uvicorn ingestion.main:app --reload`
5. Start the frontend: `cd frontend && npm run dev`

## Usage

See the [API.md](API.md) for endpoint documentation.
Use the included Simulator (`backend/simulator/main.py`) to generate test loads representing a smart factory.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
