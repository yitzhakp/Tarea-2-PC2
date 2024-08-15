# ApiTester

This project is a Vue.js application containerized with Docker. The application includes a component which allows users to make HTTP requests with various methods (GET, POST, PUT, DELETE) and view the responses.

After submitting a request, the component displays the response time and the JSON response in a formatted manner. This tool is useful for testing and debugging APIs.

### Steps

1. Clone the repository:
    ```sh
    git clone https://github.com/proyectosuninorte/ApiTester.git
    cd ApiTester
    ```

2. Build the Docker image:
    ```sh
    docker build -t vue-app .
    ```

3. Run the Docker container:
    ```sh
    docker run -p 8080:8080 vue-app
    ```

## Usage

Open your browser and navigate to `http://localhost:8080` to access the application.