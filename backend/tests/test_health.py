def test_app_imports():
    from main import app
    assert app.title == "ForestGuard EcoBlueprint API"

def test_root_endpoint():
    from main import app
    from fastapi.testclient import TestClient
    client = TestClient(app)
    resp = client.get("/")
    assert resp.status_code == 200
    data = resp.json()
    assert data["app"] == "ForestGuard EcoBlueprint API"
    assert data["version"] == "2.0.0"
