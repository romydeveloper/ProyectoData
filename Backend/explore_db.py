#Este es un script de utilidad para explorar y ver qué hay dentro de la base de datos notes.db sin usar la API.
import sqlite3
import json
from datetime import datetime

def explore_database():
    conn = sqlite3.connect('notes.db')
    cursor = conn.cursor()
    
    print("=== SQLITE DATABASE EXPLORER ===\n")
    
    # Esta sección pregunta a la base de datos qué tablas tiene y las muestra en pantalla. Es como hacer un inventario de las tablas disponibles.
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
    tables = cursor.fetchall()
    print(f"Tables: {[table[0] for table in tables]}\n")
    
    # Esta sección examina la tabla "notes" y muestra cómo está estructurada: qué columnas tiene y de qué tipo son. Es como ver el "plano" de la tabla.
    cursor.execute("PRAGMA table_info(notes);")
    columns = cursor.fetchall()
    print("Notes table structure:")
    for col in columns:
        print(f"  {col[1]} ({col[2]})")
    print()
    
    # Esta sección muestra todas las notas guardadas con sus detalles, pero de forma organizada y legible. Es como hacer un reporte completo de la base de datos.
    cursor.execute("SELECT * FROM notes;")
    notes = cursor.fetchall()
    print(f"Total notes: {len(notes)}\n")
    
    for note in notes:
        print(f"ID: {note[0]}")
        print(f"Title: {note[1]}")
        print(f"Content: {note[2][:50]}...")
        print(f"Tags: {note[3]}")
        print(f"Created: {note[4]}")
        print(f"Updated: {note[5]}")
        print(f"Archived: {note[6]}")
        print("-" * 40)
    
    conn.close()

if __name__ == "__main__":
    explore_database()