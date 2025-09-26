Access docker compose db:

- docker exec -it leaderboard-db-1 bash

Delete all containers:

- docker rm -vf $(docker ps -aq)

Delete all images:

- docker rmi -f $(docker images -aq)

When using mysql in docker compose the host is the name of the database section
in services

Curls:

Create leaderboard score

curl -X POST http://localhost:3000/leaderboard/test -H "Content-Type:
application/json" -d '{"name": "Billy"}'

With status code curl -w '\n %{http_code}'-X POST
http://localhost:3000/leaderboard/test -H "Content-Type: application/json" -d
'{"name": "Billy", "score": 100}'

Get leaderboard scores

curl -X GET http://localhost:3000/leaderboard/test
