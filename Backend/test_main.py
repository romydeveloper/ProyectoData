"""Tests para la API de Notas"""
# Estas líneas preparan las herramientas necesarias para probar automáticamente que la API funciona correctamente, sin necesidad de probar manualmente.
import pytest
from fastapi.testclient import TestClient
from main import app, notes_db

client = TestClient(app)


# esta seccion me permite Limpiar la base de datos antes de cada test
@pytest.fixture(autouse=True)
def clear_notes_db():
    notes_db.clear()
    yield
    notes_db.clear()


# Esta seccion me permite saber si:la API responde, Detecta si algo está roto,Asegura que el endpoint de salud funciona
def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "healthy", "version": "1.0.0"}


# Este test verifica que puedo crear una nota correctamente y que todos los campos se guardan como espero.
def test_create_note():
    note_data = {
        "title": "Test Note",
        "content": "This is a test note",
        "tags": ["test", "example"]
    }
    response = client.post("/notes", json=note_data)
    assert response.status_code == 200
    data = response.json()
    assert data["title"] == note_data["title"]
    assert data["content"] == note_data["content"]
    assert data["tags"] == note_data["tags"]
    assert "id" in data
    assert "created_at" in data
    assert "updated_at" in data
    assert data["archived"] == False

# Test obtener notas (lista vacía)
def test_get_notes_empty():
    response = client.get("/notes")
    assert response.status_code == 200
    data = response.json()
    assert data["notes"] == []
    assert data["total"] == 0
    assert data["page"] == 1
    assert data["total_pages"] == 0

# Test obtener notas con datos
def test_get_notes_with_data():
    # Crear una nota primero
    note_data = {"title": "Test", "content": "Content", "tags": []}
    client.post("/notes", json=note_data)
    
    response = client.get("/notes")
    assert response.status_code == 200
    data = response.json()
    assert len(data["notes"]) == 1
    assert data["total"] == 1

# Test obtener nota por ID
def test_get_note_by_id():
    # Crear nota
    note_data = {"title": "Test", "content": "Content", "tags": []}
    create_response = client.post("/notes", json=note_data)
    note_id = create_response.json()["id"]
    
    # Obtener nota por ID
    response = client.get(f"/notes/{note_id}")
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == note_id
    assert data["title"] == "Test"

# Test actualizar nota
def test_update_note():
    # Crear nota
    note_data = {"title": "Original", "content": "Content", "tags": []}
    create_response = client.post("/notes", json=note_data)
    note_id = create_response.json()["id"]
    
    # Actualizar nota
    update_data = {"title": "Updated"}
    response = client.put(f"/notes/{note_id}", json=update_data)
    assert response.status_code == 200
    data = response.json()
    assert data["title"] == "Updated"
    assert data["content"] == "Content"  # No cambió

# Test eliminar nota
def test_delete_note():
    # Crear nota
    note_data = {"title": "To Delete", "content": "Content", "tags": []}
    create_response = client.post("/notes", json=note_data)
    note_id = create_response.json()["id"]
    
    # Eliminar nota
    response = client.delete(f"/notes/{note_id}")
    assert response.status_code == 200
    assert response.json() == {"message": "Nota eliminada"}
    
    # Verificar que no existe
    get_response = client.get(f"/notes/{note_id}")
    assert get_response.status_code == 404

# Test búsqueda de notas
def test_search_notes():
    # Crear notas
    client.post("/notes", json={"title": "Python Guide", "content": "Learn Python", "tags": []})
    client.post("/notes", json={"title": "JavaScript Tips", "content": "JS tricks", "tags": []})
    
    # Buscar por título
    response = client.get("/notes?search=Python")
    assert response.status_code == 200
    data = response.json()
    assert len(data["notes"]) == 1
    assert "Python" in data["notes"][0]["title"]

# Test paginación
def test_pagination():
    # Crear múltiples notas
    for i in range(15):
        client.post("/notes", json={"title": f"Note {i}", "content": "Content", "tags": []})
    
    # Primera página
    response = client.get("/notes?page=1&limit=10")
    data = response.json()
    assert len(data["notes"]) == 10
    assert data["total"] == 15
    assert data["total_pages"] == 2
    
    # Segunda página
    response = client.get("/notes?page=2&limit=10")
    data = response.json()
    assert len(data["notes"]) == 5

# CASOS DE ERROR

# Test crear nota con datos inválidos
def test_create_note_invalid_data():
    # Título vacío
    response = client.post("/notes", json={"title": "", "content": "Content", "tags": []})
    assert response.status_code == 422
    
    # Título muy largo
    long_title = "x" * 121
    response = client.post("/notes", json={"title": long_title, "content": "Content", "tags": []})
    assert response.status_code == 422

# Test obtener nota inexistente
def test_get_nonexistent_note():
    response = client.get("/notes/nonexistent-id")
    assert response.status_code == 404
    assert response.json()["detail"] == "Nota no encontrada"

# Test actualizar nota inexistente
def test_update_nonexistent_note():
    response = client.put("/notes/nonexistent-id", json={"title": "Updated"})
    assert response.status_code == 404
    assert response.json()["detail"] == "Nota no encontrada"

# Test eliminar nota inexistente
def test_delete_nonexistent_note():
    response = client.delete("/notes/nonexistent-id")
    assert response.status_code == 404
    assert response.json()["detail"] == "Nota no encontrada"