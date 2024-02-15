import requests

def hacer_request(url):
    try:
        # Realizar la solicitud GET a la URL
        respuesta = requests.get(url)
        
        # Verificar si la solicitud fue exitosa (código de estado 200)
        if respuesta.status_code == 200:
            # Imprimir el contenido de la respuesta
            print("Contenido de la página:")
            print(respuesta.text)
        else:
            # Si la solicitud no fue exitosa, imprimir el código de estado
            print(f"La solicitud no fue exitosa. Código de estado: {respuesta.status_code}")
    except requests.exceptions.RequestException as e:
        # Capturar excepciones de solicitud
        print(f"Error al hacer la solicitud: {e}")

# URL a la que se va a hacer la solicitud (puedes cambiarla por la que desees)
url = "https://www3.animeflv.net/browse?page=1"
hacer_request(url)
