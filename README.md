# Kubernetes Example Project

This repository contains configurations and files to deploy a backend and frontend application on a Kubernetes cluster using Minikube. The backend provides a number-fetching API, and the frontend displays the fetched data.

## Prerequisites

Before starting, ensure you have the following installed:

- [Docker](https://www.docker.com/)
- [Kubectl](https://kubernetes.io/docs/tasks/tools/)
- [Minikube](https://minikube.sigs.k8s.io/docs/)

---

## Steps to Run the Project

### 1. Start Minikube

Start a Minikube cluster and configure your environment:

```bash
minikube start
eval $(minikube docker-env)
```

This ensures that Docker commands run in the Minikube environment.

---

### 2. Build Docker Images

Build the backend and frontend Docker images directly within the Minikube environment:

#### Backend
```bash
docker build -t backend-example:latest ./backend
```

#### Frontend
```bash
docker build -t frontend-example:latest ./frontend
```

---

### 3. Apply Kubernetes Configurations

Deploy the backend and frontend applications using the provided Kubernetes configurations.

#### Backend
```bash
kubectl apply -f k8s/backend-deployment.yaml
kubectl apply -f k8s/backend-service.yaml
```

#### Frontend
```bash
kubectl apply -f k8s/frontend-deployment.yaml
kubectl apply -f k8s/frontend-service.yaml
```

---

### 4. Access the Applications

#### Backend
The backend service exposes an API for fetching numbers. To access it:
```bash
kubectl get services
```
Find the backend service's `CLUSTER-IP` and port. You can use `curl` to test the endpoint:
```bash
curl http://<CLUSTER-IP>:<PORT>/number
```

#### Frontend
The frontend service exposes a web interface. Use the Minikube IP and NodePort to access it:
```bash
minikube service frontend-service
```

---

## Cleaning Up

To delete all the resources and stop Minikube:
```bash
kubectl delete -f k8s/backend-deployment.yaml
kubectl delete -f k8s/backend-service.yaml
kubectl delete -f k8s/frontend-deployment.yaml
kubectl delete -f k8s/frontend-service.yaml
minikube stop
minikube delete
```

---

## Directory Structure

```plaintext
.
├── backend/
│   ├── Dockerfile
│   ├── app.js
│   ├── package.json
│   └── ...
├── frontend/
│   ├── Dockerfile
│   ├── public/
│   │   ├── index.html
│   │   └── styles.css
│   ├── server.js
│   └── ...
├── k8s/
│   ├── backend-deployment.yaml
│   ├── backend-service.yaml
│   ├── frontend-deployment.yaml
│   ├── frontend-service.yaml
└── README.md
```

---

## Notes

1. Ensure the `API_URL` environment variable in the frontend deployment points to the backend service.
2. You may need to adjust NodePort settings in the service configurations to avoid port conflicts.

Feel free to open an issue or contribute to the project.
