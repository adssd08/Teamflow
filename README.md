# TeamFlow

Backend project built with Node.js, Express and TypeScript.

## Stack

- Node.js 22.18.0 (specified in `.nvmrc`)
- Express 5
- TypeScript with strict checking and NodeNext modules
- dotenv for environment variables
- tsx for development with automatic restart

## Local setup

Use Node.js 22.18.0. If you use nvm:

```sh
nvm install
nvm use
```

Install dependencies and create the local environment file:

```sh
npm ci
cp .env.example .env
```

### Environment configuration

| Variable | Example | Default | Purpose          |
| -------- | ------- | ------- | ---------------- |
| `PORT`   | `3000`  | `3000`  | HTTP server port |

`src/config/env.ts` loads `.env` using dotenv and exposes the port configuration. `.env`, `node_modules` and `dist` are ignored by Git.

## Run the server

Development mode:

```sh
npm run dev
```

Compile and run the JavaScript output:

```sh
npm run build
npm start
```

The server listens on port `3000` by default.

## Health endpoint

```sh
curl http://localhost:3000/health
```

`GET /health` returns HTTP `200` with a JSON response:

```json
{ "status": "ok" }
```

## Project structure

```text
src/
├── config/
│   └── env.ts
├── controllers/
├── middleware/
├── repositories/
├── routes/
├── services/
├── validators/
└── index.ts
```

`src/index.ts` creates the Express app, registers the health endpoint and starts the server. `src/config/env.ts` contains environment configuration. The remaining directories are empty scaffolding.

## Type checking

```sh
npx tsc --noEmit
```
