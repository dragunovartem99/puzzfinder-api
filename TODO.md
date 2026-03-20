# TODO

## Critical

- [ ] **Request validation** — no validation on `POST /api/puzzles/search` body; invalid `page`/`limit` (negative, zero, huge) and unknown sort fields pass through unchecked
- [ ] **Error handling** — all errors return generic 500; add 400 for bad requests, extract error middleware, type catch parameters
- [ ] **`PORT` config** — `Number(process.env.PORT)` returns `NaN` when unset; add fallback: `Number(process.env.PORT) || 3000`

## Quality

- [ ] **Tests** — zero coverage; at least unit-test the repository filter-building logic and pagination helper
- [ ] **Thin service layer** — `PuzzleService` is a pure passthrough; either add business logic or collapse it into the controller
- [ ] **Rate limiting** — no protection against request floods; add `express-rate-limit`
- [ ] **Structured logging** — replace `console.error` with a proper logger (e.g. `pino`)

## Nice to Have

- [ ] **Health check endpoint** — `GET /health` for container orchestration readiness probes
- [ ] **API documentation** — at minimum, document request/response shapes in README
- [ ] **Response compression** — add `compression` middleware for gzip
- [ ] **DB path validation** — warn at startup if `DB_PATH` file does not exist
- [ ] **Query result limit** — cap maximum `limit` to prevent memory exhaustion on large result sets
