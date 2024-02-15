import json
from prompt_toolkit import prompt
from prompt_toolkit.completion import Completer, WordCompleter, Completion
from prompt_toolkit.document import Document
from prompt_toolkit.completion import CompleteEvent
from prompt_toolkit.shortcuts import radiolist_dialog

from typing import Iterable

# Almacen de "Completers"
completerByTitle = []
currentCompleter = ""
currentCompleters = []

# Función para cargar los datos del archivo JSON
def cargar_datos():
    try:
        with open('assets/database.json', 'r', encoding='utf-8') as file:
            data = json.load(file)
            for item in data:
                completerByTitle.append(item["title"])
                for alternativeTitle in item["alternativeTitles"]:
                    completerByTitle.append(alternativeTitle)
        return data
    except FileNotFoundError:
        print("No se encontró el archivo 'database.json'.")
        return []

# Función para guardar los datos en el archivo JSON
def guardar_datos(datos):
    with open('assets/database.json', 'w') as archivo:
        json.dump(datos, archivo, indent=4)

# Función para agregar una nueva entrada al archivo JSON
def agregar_entrada(datos, nueva_entrada):
    datos.append(nueva_entrada)
    guardar_datos(datos)
    print("Nueva entrada agregada exitosamente.")

# Función para buscar una entrada por título en el archivo JSON
def buscar_por_titulo(datos, titulo):
    for entrada in datos:
        if entrada['title'].lower() == titulo.lower():
            return entrada
    return None

# Función para eliminar una entrada por título en el archivo JSON
def eliminar_por_titulo(datos, titulo):
    entrada = buscar_por_titulo(datos, titulo)
    if entrada:
        datos.remove(entrada)
        guardar_datos(datos)
        print("Entrada eliminada exitosamente.")
    else:
        print("No se encontró ninguna entrada con ese título.")

# Función para listar todas las entradas en el archivo JSON
def listar_entradas(datos):
    for entrada in datos:
        print("Título:", entrada['title'])
        print("  Alternativas:", entrada['alternativeTitles'])
        print("  Tipo:", entrada['types'])
        print("  Etiquetas:", entrada['tags'])
        print("  Enlaces:")
        for link in entrada['links']:
            print("    - Fuente:", link['source'])
            print("      URL:", link['url'])
        print()

# Función para editar una entrada por título en el archivo JSON
def editar_entrada(datos, titulo):
    entrada = buscar_por_titulo(datos, titulo)
    if entrada:
        print("Entrada encontrada:")
        print(json.dumps(entrada, indent=4))
        print("Ingrese los nuevos datos para la entrada:")
        nuevos_datos = json.loads(input("Ingrese los nuevos datos en formato JSON: "))
        # Actualizar los datos de la entrada
        entrada.update(nuevos_datos)
        guardar_datos(datos)
        print("Entrada editada exitosamente.")
    else:
        print("No se encontró ninguna entrada con ese título.")

# Función principal
def main():
    database = cargar_datos()

    while True:
        print("Gestor de base de datos de anime y películas")
        print("1. Agregar nueva entrada")
        print("2. Buscar entrada por título")
        print("3. Eliminar entrada por título")
        print("4. Listar todas las entradas")
        print("5. Editar entrada por título")
        print("6. Salir")
        getCompleter(["abbb","cbbc"])
        opcion = prompt("Seleccione una opción: ", completer=dynamic_completer)

        if opcion == '1':
            nueva_entrada = json.loads(input("Ingrese los datos de la nueva entrada en formato JSON: "))
            agregar_entrada(database, nueva_entrada)
        elif opcion == '2':
            titulo = input("Ingrese el título de la entrada que desea buscar: ")
            entrada_encontrada = buscar_por_titulo(database, titulo)
            if entrada_encontrada:
                print("Entrada encontrada:")
                print(json.dumps(entrada_encontrada, indent=4))
            else:
                print("No se encontró ninguna entrada con ese título.")
        elif opcion == '3':
            titulo = input("Ingrese el título de la entrada que desea eliminar: ")
            eliminar_por_titulo(database, titulo)
        elif opcion == '4':
            print("Listado de todas las entradas:")
            listar_entradas(database)
        elif opcion == '5':
            titulo = input("Ingrese el título de la entrada que desea editar: ")
            editar_entrada(database, titulo)
        elif opcion == '6':
            print("¡Hasta luego!")
            break
        else:
            print("Opción no válida. Por favor, seleccione una opción válida.")
completerMain = ["1","21"]

class DynamicCompleter(Completer):
    def __init__(self, completerMain):
        self.completerMain = completerMain
    def get_completions(self, document: Document, complete_event: CompleteEvent) -> Iterable[Completion]:
        nextCompleter = WordCompleter(currentCompleter, ignore_case = True)
        return nextCompleter.get_completions(document, complete_event)

def getCompleter(list):
    currentCompleter = list

dynamic_completer = DynamicCompleter(completerMain)

if __name__ == "__main__":
    main() 