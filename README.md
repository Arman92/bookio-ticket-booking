
[![Node.js CI](https://github.com/Arman92/shypple-ticket-booking/actions/workflows/node.js.yml/badge.svg)](https://github.com/Arman92/shypple-ticket-booking/actions/workflows/node.js.yml)


# shypple-ticket-booking
Ticket booking backend service for Shypple backend interview

## Installation
```bash
 git clone git@github.com:Arman92/shypple-ticket-booking.git 
 yarn install
```

## Docker
This project has ready to test docker-compose configs.
There are two docker-compose and Dockerfiles, one for production and the other for development with hot reload
and debug ability.

First, you'll need to copy `.env.template` and rename it to `.env`

It should look something like the following, for a Docker environment:

```bash
APP_PORT=8000                        # Exposed port for node.js server app
APP_HOST=localhost                   # localhost is ok on docker


# Config for MongoDB
MONGO_DB_NAME = "shyppleDb"
MONGO_USER = "shyppleDbUser"
MONGO_PASSWORD = "some-secret-pass"
MONGO_HOST = "database-dev"         # If you changed MONGO_HOST, remember to change it on docker-compose.yml also.
MONGO_PORT=27017

```

After setting `.env`, you are ready to run the backend services:
```bash
docker-compose up -d                                      # For production
# or
docker-compose -f ./docker-compose.dev.yml up -d          # For development and debugging
```

If you are using VS Code, you can also debug the service by attaching to the exposed debug port. `.vscode` configs are pre-configured.