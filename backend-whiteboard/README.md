# Local db with docker:

docker run --name mongoWhiteboard -e MONGO_INITDB_DATABASE='whiteboard' -e MONGO_INITDB_ROOT_USERNAME='whiteboard' -e MONGO_INITDB_ROOT_PASSWORD='27365148' -p 27018:27017 -d mongo:latest