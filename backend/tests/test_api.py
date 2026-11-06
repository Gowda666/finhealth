import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health_endpoint():
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "privacy" in data

def test_sample_endpoint():
    response = client.get("/api/sample?currency=%E2%82%B9")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "success"
    assert "health_score" in data
    assert data["health_score"]["total"] > 0
    assert "summary" in data
    assert "monthly_trends" in data
    assert "categories" in data
    assert len(data["transactions"]) > 0

def test_upload_csv_endpoint():
    csv_bytes = b"""Date,Description,Debit,Credit,Balance
01/05/2026,Salary Credit,,85000,85000
03/05/2026,Rent Payment,24000,,61000
05/05/2026,Swiggy Dining,850,,60150
"""
    files = {"file": ("statement.csv", csv_bytes, "text/csv")}
    response = client.post("/api/upload", files=files)
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "success"
    assert data["summary"]["total_income"] == 85000.0
    assert data["summary"]["total_expenses"] == 24850.0
