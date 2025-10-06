# Makefile para Notes App

.PHONY: help up down build logs clean dev prod test

help: ## Mostrar ayuda
	@echo "Comandos disponibles:"
	@echo "  up       - Levantar servicios en desarrollo"
	@echo "  down     - Detener servicios"
	@echo "  build    - Construir imágenes"
	@echo "  logs     - Ver logs"
	@echo "  clean    - Limpiar contenedores e imágenes"
	@echo "  dev      - Modo desarrollo"
	@echo "  prod     - Modo producción"
	@echo "  test     - Ejecutar tests"

up: ## Levantar servicios
	docker-compose up -d

down: ## Detener servicios
	docker-compose down

build: ## Construir imágenes
	docker-compose build

logs: ## Ver logs
	docker-compose logs -f

clean: ## Limpiar contenedores e imágenes
	docker-compose down -v --rmi all --remove-orphans

dev: ## Modo desarrollo
	docker-compose up --build

prod: ## Modo producción
	docker-compose -f docker-compose.prod.yml up --build -d

test: ## Ejecutar todos los tests
	@echo "Ejecutando tests del backend..."
	cd Backend && python -m pytest -v
	@echo "Ejecutando tests del frontend..."
	cd Frontend && npm test

test-backend: ## Ejecutar solo tests del backend
	cd Backend && python -m pytest -v

test-frontend: ## Ejecutar solo tests del frontend
	cd Frontend && npm test

test-coverage: ## Ejecutar tests con coverage
	cd Backend && python -m pytest --cov=main
	cd Frontend && npm test -- --coverage

restart: ## Reiniciar servicios
	docker-compose restart

status: ## Estado de los servicios
	docker-compose ps