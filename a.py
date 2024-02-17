import sqlite3

# Conectar a la base de datos (si no existe, se creará)
conn = sqlite3.connect('example.db')

# Crear un cursor para ejecutar sentencias SQL
cursor = conn.cursor()

# Definir la sentencia SQL para crear la tabla
sql_create_table = """
CREATE TABLE IF NOT EXISTS MiTabla (
    id INTEGER PRIMARY KEY,
    nombre TEXT NOT NULL,
    edad INTEGER
);
"""

# Ejecutar la sentencia SQL
cursor.execute(sql_create_table)

# Guardar los cambios y cerrar la conexión
conn.commit()
conn.close()

print("La tabla se ha creado correctamente.")
