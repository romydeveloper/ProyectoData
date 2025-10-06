# Importaciones para manejo de base de datos


import sqlite3  # Este es el cliente básico de SQLite para Python, debe usarse para operaciones directas con la base de datos.)

# Es un ORM (Object-Relational Mapping) que me permite trabajar con bases de datos usando objetos de Python en lugar de SQL puro
from sqlalchemy import create_engine, Column, String, DateTime, Boolean, Text  



from sqlalchemy.ext.declarative import declarative_base  # Crea una clase base de la cual heredan todos los modelos de base de datos.


from sqlalchemy.orm import sessionmaker  # Crea sesiones para manejar transacciones con la base de datos.

from datetime import datetime  # Para manejar fechas y horas (timestamps de creación y actualización).


import json  # Para convertir listas de Python a texto JSON y viceversa (se usaran para los tags de las notas).

# Esta sección configura la conexión a SQLite y prepara las herramientas para crear y manejar la base de datos
DATABASE_URL = "sqlite:///./notes.db"
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Modelo de base de datos:Esta clase define la "plantilla" de cómo se guardan las notas en la base de datos, con todos sus campos y reglas.
class NoteDB(Base):
    __tablename__ = "notes"
    
    id = Column(String, primary_key=True, index=True)
    title = Column(String(120), nullable=False)
    content = Column(Text, nullable=False)
    tags = Column(Text, default="[]")  # JSON string
    created_at = Column(DateTime, default=datetime.now)
    updated_at = Column(DateTime, default=datetime.now, onupdate=datetime.now)
    archived = Column(Boolean, default=False)

# Crear tablas es como decir: "Oye SQLAlchemy, toma todos los modelos que definí (NoteDB) y créalos físicamente en la base de datos si no existen"
Base.metadata.create_all(bind=engine)

# Función para obtener sesión de BD:  Es como un bibliotecario que te presta un libro, y sin importar si lo terminas de leer o no, siempre se asegura de que lo devuelvas.
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()