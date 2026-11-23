# Ayyur — Atelier Ayyur

**A full-stack e-commerce web application for a premium handcrafted bag brand.**

Ayyur is a web application composed of a frontend interface (**Atelier Ayyur**) and a Java backend (**Ayyur Backend**). The project aims to provide an online shopping experience for a handcrafted bag brand, combining a modern web interface with a RESTful backend architecture.

## Project Structure

```text
ayyur/
├── atelier-ayyur/                 # Frontend application
├── ayyur-backend/                 # Java backend and API
├── atelier-ayyur.code-workspace   # VS Code workspace configuration
└── .gitignore
```

## Technologies Used

### Frontend
- JavaScript
- HTML5
- CSS3
- React / Vite (if applicable to the current frontend version)

### Backend
- Java
- Spring Boot
- REST API
- JWT Authentication

### Deployment & Integration
- Railway
- WhatsApp Business integration

## Main Features

- Online storefront for a premium handcrafted bag brand.
- Full-stack architecture separating the frontend and backend.
- REST API development using Spring Boot.
- Secure authentication using JWT.
- WhatsApp Business integration to facilitate customer communication.
- Online deployment through Railway.

## Prerequisites

Make sure you have installed:

- Node.js and npm
- Java JDK
- Maven
- Git

## Installation & Setup

### 1. Clone the repository

```bash
git clone https://github.com/baccouchenourane/ayyur.git
cd ayyur
```

### 2. Start the Backend

```bash
cd ayyur-backend
```

Configure the application settings and required environment variables.

Run the Spring Boot application:

```bash
./mvnw spring-boot:run
```

On Windows:

```bash
mvnw.cmd spring-boot:run
```

### 3. Start the Frontend

Open another terminal:

```bash
cd atelier-ayyur
npm install
npm run dev
```

The frontend will be available at the local address displayed by Vite in the terminal.

## Deployment

The application has been deployed online using **Railway**.

## Project Goals

- Apply full-stack development concepts to a real-world e-commerce project.
- Design and integrate a frontend with a Java Spring Boot backend.
- Implement secure authentication and API communication.
- Integrate external communication services.
- Gain practical experience in application deployment.

## Author

**Nourane Baccouche**

- GitHub: [@baccouchenourane](https://github.com/baccouchenourane)
- Repository: [Ayyur](https://github.com/baccouchenourane/ayyur)
