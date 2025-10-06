# Leaderboard API Typescript

## Description
Express API for loading and saving leaderboard scores

## Developement

### Commands
- Install for development: `yarn install -D`
- Run tests: `yarn test`
- Run locally with docker: `docker compose up`

### Test Curls
- Get leaderboard test:
curl -X GET http://localhost:3000/leaderboard/test -H "x-api-key:test-key" -H "Content-Type: application/json"

- Insert score into leaderboard test:
curl -X POST http://localhost:3000/leaderboard/test -H "Content-Type: application/json" -H "x-api-key: test-key" -d '{"name": "Billy", "score": 100}'

## Production
- Build and run the Dockerfile