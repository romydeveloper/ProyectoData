#Este archivo Main lo dipuse para alojar el Crud

#primero instale la libreria de FastApi, luego  reemplaze el codigo de instalacion de FastApi ya que nesecitaba las siguientes funcionalidades: la validacion de datos con BaseModel, el  datatime para las fechas y el CORS para conexion con el frontend.
# Decidi utilzar Python para mejorar mi manejo del lenguaje y aprovechar las clases nativas como el Typing, uuid y datetime fundamentales para el CRUD y para cumplir con algunos requerimientos del proyecto como darle un ID unico a cada nota y agregarle fecha a cada nota creada.

from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Optional
import uuid
from datetime import datetime
import os
import json
from sqlalchemy.orm import Session
from database import get_db, NoteDB

app = FastAPI(title="API de Notas", version="1.0.0")

# Esta seccion Es un permiso de seguridad que le dice al navegador: "Está bien que este frontend se conecte con este backend, aunque estén en puertos/dominios diferentes". Sin esto, el frontend no podría comunicarse con la API.
# evitar errores de política de mismo origen entre frontend y backend.
#Habilita CORS para conexión con el frontend.
#El "*" es solo para desarrollo. En producción se deben especificar los dominios exactos.
# Configurar CORS basado en el entorno
allowed_origins = ["*"] if os.getenv("ENVIRONMENT") == "development" else [
    "http://localhost:3000",
    "http://localhost:80",
    "http://frontend"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Con esta seccion defino el contrato de datos que garantiza que cuando alguien envíe una petición POST para crear una nota, los datos cumplan exactamente con estas reglas. Si no cumplen, FastAPI automáticamente rechaza la petición con un error de validación.
class NoteCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=120)
    content: str = Field(..., min_length=1, max_length=10000)
    tags: List[str] = []

# Esta seccion es un modelo flexible que permite actualizaciones parciales - solo cambio lo que necesito, sin tener que enviar todos los datos de la nota completa.
class NoteUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    tags: Optional[List[str]] = None
    archived: Optional[bool] = None

# esta seccion es la representación completa de una nota que incluye tanto los datos del usuario (título, contenido, tags) como los metadatos del sistema (ID, fechas, estado). Es lo que se devuelve en las respuestas de la API y lo que se almacena internamente.
class Note(BaseModel):
    id: str
    title: str
    content: str
    tags: List[str]
    created_at: datetime
    updated_at: datetime
    archived: bool = False

# Base de datos SQLite configurada en database.py

# Root endpoint
@app.get("/")
def root():
    return {
        "message": "API de Notas funcionando",
        "version": "1.0.0",
        "endpoints": {
            "health": "/health",
            "docs": "/docs",
            "notes": "/notes"
        }
    }

# Health check endpoint
@app.get("/health")
def health_check():
    return {"status": "healthy", "version": "1.0.0"}


#esta seccion es el endpoint de creación que toma los datos básicos del usuario (título, contenido, tags), les agrega automáticamente un ID único y fechas, y almacena la nota completa. Implementa la funcionalidad "Create" del CRUD de manera completa y robusta.
@app.post("/notes")
def create_note(note: NoteCreate, db: Session = Depends(get_db)):
    db_note = NoteDB(
        id=str(uuid.uuid4()),
        title=note.title,
        content=note.content,
        tags=json.dumps(note.tags),
        created_at=datetime.now(),
        updated_at=datetime.now(),
        archived=False
    )
    db.add(db_note)
    db.commit()
    db.refresh(db_note)
    
    return Note(
        id=db_note.id,
        title=db_note.title,
        content=db_note.content,
        tags=json.loads(db_note.tags),
        created_at=db_note.created_at,
        updated_at=db_note.updated_at,
        archived=db_note.archived
    )

#esta seccion es el endpoint de listado inteligente que combina tres funcionalidades: obtener todas las notas, buscar por contenido, y paginar resultados. Implementa la funcionalidad "Read" del CRUD de manera completa y eficiente.
@app.get("/notes")
def get_notes(page: int = 1, limit: int = 10, search: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(NoteDB)
    
    # Filtrar por búsqueda si se proporciona
    if search:
        query = query.filter(
            (NoteDB.title.contains(search)) | 
            (NoteDB.content.contains(search))
        )
    
    total = query.count()
    db_notes = query.offset((page - 1) * limit).limit(limit).all()
    
    # Convertir a modelo Pydantic
    notes = []
    for db_note in db_notes:
        notes.append(Note(
            id=db_note.id,
            title=db_note.title,
            content=db_note.content,
            tags=json.loads(db_note.tags),
            created_at=db_note.created_at,
            updated_at=db_note.updated_at,
            archived=db_note.archived
        ))
    
    return {
        "notes": notes,
        "total": total,
        "page": page,
        "limit": limit,
        "total_pages": (total + limit - 1) // limit
    }

#esta seccion es el endpoint de búsqueda individual que implementa la funcionalidad "Read by ID" del CRUD me permite buscar una nota por ID y si no existe me va a retornar el tipico error 404, esto para cumplir con las requerimientos del proyecto.
@app.get("/notes/{note_id}")
def get_note(note_id: str, db: Session = Depends(get_db)):
    db_note = db.query(NoteDB).filter(NoteDB.id == note_id).first()
    if not db_note:
        raise HTTPException(status_code=404, detail="Nota no encontrada")
    
    return Note(
        id=db_note.id,
        title=db_note.title,
        content=db_note.content,
        tags=json.loads(db_note.tags),
        created_at=db_note.created_at,
        updated_at=db_note.updated_at,
        archived=db_note.archived
    )

# este endpoint es un sistema de actualización selectiva que permite modificar solo los campos específicos que el usuario quiere cambiar, manteniendo intactos los demás datos. Esto es más eficiente y user-friendly que requerir todos los campos en cada actualización.
@app.put("/notes/{note_id}")
def update_note(note_id: str, note_update: NoteUpdate, db: Session = Depends(get_db)):
    db_note = db.query(NoteDB).filter(NoteDB.id == note_id).first()
    if not db_note:
        raise HTTPException(status_code=404, detail="Nota no encontrada")
    
    # Solo actualizar campos que se enviaron
    update_data = note_update.model_dump(exclude_unset=True)
    
    if 'title' in update_data:
        db_note.title = update_data['title']
    if 'content' in update_data:
        db_note.content = update_data['content']
    if 'tags' in update_data:
        db_note.tags = json.dumps(update_data['tags'])
    if 'archived' in update_data:
        db_note.archived = update_data['archived']
    
    db_note.updated_at = datetime.now()
    db.commit()
    db.refresh(db_note)
    
    return Note(
        id=db_note.id,
        title=db_note.title,
        content=db_note.content,
        tags=json.loads(db_note.tags),
        created_at=db_note.created_at,
        updated_at=db_note.updated_at,
        archived=db_note.archived
    )

#esta seccion es el endpoint de eliminación definitiva que completa el CRUD, implementando la funcionalidad "Delete" de manera segura con validación de existencia y confirmación de la operación exitosa.
@app.delete("/notes/{note_id}")
def delete_note(note_id: str, db: Session = Depends(get_db)):
    db_note = db.query(NoteDB).filter(NoteDB.id == note_id).first()
    if not db_note:
        raise HTTPException(status_code=404, detail="Nota no encontrada")
    
    db.delete(db_note)
    db.commit()
    return {"message": "Nota eliminada"}