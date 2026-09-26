# <img src="/logo.png" width="30"> Puzzfinder API

Discover hidden gems in Lichess' multi-million puzzle database with fast, filter-based searches

The project consists of three components:

- [Client-side web interface](https://github.com/dragunovartem99/puzzfinder)
- [Application programming interface](https://github.com/dragunovartem99/puzzfinder-api)
- [DuckDB database with chess puzzles](https://github.com/dragunovartem99/puzzfinder-db)

Any server-side advice/help will be very welcomed! This is my first full-stack project.

## Development

```sh
npm ci
npm run dev
```

The API reads the DuckDB file built by [puzzfinder-db](https://github.com/dragunovartem99/puzzfinder-db).
`npm run types:generate` regenerates `types/api.d.ts` from [`openapi.yaml`](openapi.yaml). Pull
requests run `format:check`, `types:check`, `lint:check` and `test`, and so does the pre-commit hook

## Deployment

Merging to `main` runs the same checks, then [pipes](https://github.com/dragunovartem99/pipes)
`deploy-vps` resets the checkout on the VPS to the commit and runs [`deploy.sh`](deploy.sh), which
installs the Caddy site and rebuilds the container. Repository secrets: `VPS_HOST`, `VPS_USER`,
`VPS_SSH_KEY`, `VPS_PROJECT_PATH`
