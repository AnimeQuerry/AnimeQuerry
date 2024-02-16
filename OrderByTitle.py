import json

def verify(json_data):
    verificated = []
    for item in json_data:
        default = {
            "id": item.get("id", 1),
            "title": item.get("title", ""),
            "alternativeTitles": item.get("alternativeTitles", []),
            "type": item.get("type", ""),
            "tags": item.get("tags", []),
            "links": item.get("links", []),
            "favorite": False
        }
        verificated.append(default)
    verificated.sort(key=lambda x: x["title"])
    return verificated

# Cargar el JSON desde el archivo
with open("./assets/database.json", "r", encoding="UTF-8") as file:
    data = json.load(file)

# Agregar la clave "categories" si no está presente
data = verify(data)

# Guardar el JSON modificado en un nuevo archivo
with open("./assets/database.json", "w") as file:
    json.dump(data, file, indent=4)

print("Se ha creado el archivo 'database.json' con el JSON modificado.")
