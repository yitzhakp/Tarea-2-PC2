 # Actividad PC2

# Proyecto Docker Composer

Este proyecto utiliza Docker y Docker Compose para gestionar múltiples servicios. 
## Requisitos

- Docker (última versión recomendada)
- Docker Compose (última versión recomendada)

## Instalación

1. Clona el repositorio:
    ```bash
    git clone https://github.com/yitzhakp/Tarea-2-PC2
    cd tu-repo
    ```

2. Construye y ejecuta los contenedores:
    ```bash
    docker-compose up --build
    ```

3. Elimina los contenedores y volumenes previos:
    ```bash
    docker-compose down -v --rmi all
    ```
    
## Estructura del Proyecto

- **cont2/**: Contiene el Dockerfile y la aplicación para el contenedor 2.
- **cont3/**: Contiene el Dockerfile y la aplicación para el contenedor 3.
- **proxy/**: Contiene el Dockerfile y la configuración de la pagina web

## Archivos Clave

- **Dockerfile**: Define cómo construir las imágenes para cada contenedor.
- **requirements.txt**: Lista las dependencias de Python necesarias para los contenedores basados en Python.

## Uso

- Accede a la aplicación a través de [http://localhost](http://localhost) o sino a traves de la direccion: (http://127.0.0.1:80).
- Usa las rutas `/cont2/` y `/cont3/` para acceder a los respectivos contenedores.
