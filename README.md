# poly-world

A simple world to have fun in.

![image](https://github.com/ChristopherTrimboli/poly-world/assets/27584221/c669d6b7-cffe-45e7-8204-6ded9fb5dbaa)

## Dev Guide

- `npm i`
- `npm run dev`

#### Backend uWebSocket

- `npm run dev-socket` (local dev)
- `npm run build-socket`
- `npm run start-socket` (production)

Local dev runs on `ws://localhost:9001`

Production hosted on: `wss://poly-world-75fe1d48fc05.herokuapp.com`

#### Enviroment Variables

- Create `.env.local` file in root.

```bash
NEXT_PUBLIC_WS_URL = ws://localhost:9001
```

#### Deploy to Heroku

`heroku login`

`git push heroku main`

`heroku logs --tail`
