# Aufmerksamkeit

**An interactive web application about digital distraction and mindful smartphone use.**

[Deutsch](README.md) · [License](LICENSE) · [Authors and materials](docs/ATTRIBUTION.md)

Aufmerksamkeit combines a short self-reflection questionnaire with deliberate distractions, a personal evaluation, animated tips and a community section. It makes common mechanisms of the attention economy tangible. It is intended for people who want to reflect on their digital habits.

**Yakub Uyar** developed the application, including the database, API and Rive integration with state controls. The Rive design is an anonymous contribution; see the [attribution notes](docs/ATTRIBUTION.md).

## Screenshots

These captures show the actual running German interface with fictional sample data.

### Introduction

![German start page of the Aufmerksamkeit application](assets/screenshots/start.png)

### Questionnaire with distractions

![Questionnaire with selectable answers and distraction cards](assets/screenshots/test.png)

### Evaluation

![Personal evaluation with elapsed time and opened distractions](assets/screenshots/auswertung.png)

### Interactive tips

![Smartphone tips with interactive Rive animations](assets/screenshots/tipps.png)

### Community invitation

![Community introduction inviting visitors to exchange experiences](assets/screenshots/community-einstieg.png)

### Community

![Community section with fictional posts and animated characters](assets/screenshots/community.png)

## Features

- Twelve-question questionnaire with a timer and deliberately offered distractions
- Personal evaluation showing answered questions, opened distractions and elapsed time
- Comparison with runs stored in the installation's database
- Five interactive smartphone tips using Rive state machines
- Community posts with a name or pseudonym, age, a gender selection and likes
- PostgreSQL persistence for posts, likes and aggregate questionnaire results

The questionnaire supports self-reflection. It is neither a medical test nor a scientifically validated measurement tool. The comparison charts about digital habits are illustrative content, not a representative study conducted by this project.

## Technology and decisions

| Area | Implementation |
| --- | --- |
| Web application | Next.js 16 App Router and React 19; interface and API share one project. |
| Interface | TypeScript, Tailwind CSS 4, Framer Motion and Lenis for styling, transitions and scrolling. |
| Animations | Rive with React Canvas; user input controls states, triggers and characters. |
| Data | PostgreSQL 16 and Prisma 6 with versioned migrations. |
| Likes | A session cookie associates likes with a browser; a unique database index prevents duplicate likes within a session. |
| Setup | Docker Compose starts the application and database; a named volume preserves data. |

## Run locally

Requirement: Docker with Docker Compose, for example Docker Desktop. Docker must be running. The first build needs internet access for packages and fonts.

```sh
git clone https://github.com/Yakub-Tech/Aufmerksamkeit.git
cd Aufmerksamkeit
cp .env.example .env
docker compose up -d --build
```

Open [http://localhost:3000](http://localhost:3000). Migrations run when the container starts. Sample data is created by default: 25 fictional questionnaire runs and five fictional posts. Displayed totals and averages include this sample data and are not evidence of actual user numbers. Setting `SEED_DEMO=false` in `.env` disables automatic seeding for a new database; it does not remove existing sample data.

Credentials in `.env.example` are local example values only. Set your own values for other environments and adjust `DATABASE_URL` consistently. `.env` is excluded from publication. `SESSION_COOKIE_SECURE=false` is only for local HTTP use. Set `SESSION_COOKIE_SECURE=true` when running with HTTPS; a production start outside Compose requires secure cookies unless explicitly overridden. The Compose configuration exposes the website only on the local machine; PostgreSQL has no published port.

```sh
docker compose logs -f web  # Inspect startup and errors
docker compose down        # Stop; preserve stored data
docker compose up -d       # Restart existing containers
```

`docker compose down -v` deletes stored data. Use it only for an intentional reset of a disposable test environment.

## Reuse an existing database

Older versions created tables with `prisma db push`. For a populated database without the `_prisma_migrations` table, `migrate deploy` fails with P3005. New, empty databases do not need the following steps.

Keep the existing `POSTGRES_*` credentials, matching `DATABASE_URL` and database volume. Also keep the Compose project name unchanged so that the same volume is used. Do not replace existing credentials with the example values. `SEED_DEMO=false` prevents additional sample data from being created.

First stop the web container, create a backup outside the repository and inspect the existing schema:

```sh
docker compose stop web
docker compose up -d db
docker compose exec -T db sh -c 'pg_dump -U "$POSTGRES_USER" -d "$POSTGRES_DB" --format=custom' > ~/Aufmerksamkeit-backup.dump
docker compose build web
docker compose run --rm --no-deps web npx prisma db pull --print
```

The backup contains the database, not the `.env` file. Store credentials separately and securely, and test restoration using PostgreSQL tools in a separate database.

**Proceed only if there is no `_prisma_migrations` table and the displayed schema matches the known previous state:** `Comment` including `gender`, `CommentLike` with a unique combination of session and post, and `TestStat` and `TestResult`, with the columns and relationships defined in `prisma/schema.prisma`. A different schema or an existing migration history requires a separate assessment.

For this specific state, mark the three migrations already represented in the schema as applied. Then deploy the new migration completing the schema:

```sh
docker compose run --rm --no-deps web npx prisma migrate resolve --applied 20260429093119_initial_schema
docker compose run --rm --no-deps web npx prisma migrate resolve --applied 20260518122635_add_likes_to_comment
docker compose run --rm --no-deps web npx prisma migrate resolve --applied 20260531124607_add_gender
docker compose run --rm --no-deps web npx prisma migrate deploy
docker compose up -d web
```

This procedure was tested against an isolated database with the previous `db push` schema; an existing sample post remained unchanged. This does not replace checking your own database. Do not delete the volume. If errors occur, keep the web application stopped until the schema and migrations have been checked.

## Development and checks

Requirements: Node.js 22, npm and a reachable PostgreSQL 16 database. For development outside the web container, `DATABASE_URL` must point to an accessible database address; the Compose hostname `db` only works inside the Compose network.

For a local development database, use the existing Compose configuration with its port override:

```sh
docker compose -f docker-compose.yml -f compose.dev.yml up -d db
```

In `.env`, change only the database hostname in `DATABASE_URL` from `db` to `localhost`. Keep the user, password and database name consistent with the `POSTGRES_*` values. The override exposes PostgreSQL only on `127.0.0.1:5432`. Stop any existing local database on that port or configure a different port consistently. Stop any running web container with `docker compose stop web` to free port 3000. Then start the web application outside Docker:

```sh
npm ci
npx prisma generate
npm run prisma:migrate
npm run prisma:seed  # optional: fictional sample data only
npm run dev
```

The development server listens on port 3000. Before running the web application with Docker again, restore the hostname `db` in `DATABASE_URL`. Next.js and Prisma read `.env`. For a local production build and start:

```sh
npm run lint
npm run build
npm start
```

API tests require a separately running application with a disposable test database. **Tests write posts, likes and questionnaire results. Never run them against a production installation.**

```sh
TEST_BASE_URL=http://127.0.0.1:3000 npm test
```

GitHub Actions installs packages from the lockfile, runs lint, production dependency auditing and build, and checks the API against an isolated PostgreSQL database. These checks do not replace a full security, accessibility or load assessment.

The targeted npm override for `@prisma/config` uses `deepmerge-ts` 8.0.2 to avoid a stack overflow in the Prisma CLI. Some security advisories still affect development tools. Run lint and similar tools only on trusted project files; production dependencies are checked separately with `npm audit --omit=dev`.

## Project structure

```text
app/                Page, layout and Next.js API routes
components/         Questionnaire, evaluation, tips and community interface
hooks/              Shared React hooks
lib/                Prisma client, session cookie and asset URL helper
prisma/             Schema, migrations and fictional sample data
public/             Locally served animations and media
assets/screenshots/ Real captures for documentation
test/               API integration tests and asset URL regression test
```

## Usage and limitations

1. Select “Jetzt loslegen” on the start page.
2. Answer the twelve questions. Opening distraction cards is counted separately.
3. View the evaluation and try the smartphone tips.
4. Write a fictional community post and add or remove likes.

There are no user accounts, administration interface or post moderation. A like belongs to a browser cookie, not a verified person. Questionnaire results are voluntarily submitted values, not tamper-proof statistics. Individual answers stay in the browser; the server stores elapsed time and the number of opened distractions.

Community posts are visible to every visitor of the installation. Only use fictional sample names, ages and gender selections. The community form requires a gender selection, which also determines the animated character. The application sets a long-lived session cookie for likes. The API validates inputs but does not provide comprehensive spam protection, access control or privacy management. Before public operation, operators must address moderation, abuse prevention, deletion mechanisms, privacy notices, HTTPS, access permissions and backups for their actual use. This publication does not include a public live demo.

The database is stored in a Docker volume. For data that must be retained, create PostgreSQL backups and test restoration in a separate environment. Cloning the repository does not back up runtime data.

## License and responsibility

Copyright © 2026 **Yakub Uyar**. Original code and documentation are provided under [custom German-English license terms](LICENSE).

Viewing, downloading, own use, adaptation and free redistribution with source code and notices are permitted. Associations and businesses may use the software for their own activities, including revenue-generating activities. Selling the software or derived versions and offering it as a paid software service require express permission from Yakub Uyar. This restricted license is not an open-source license. Third-party libraries and materials retain their respective rights.

Use is at your own risk and in the software's existing condition. Operators must review suitability, setup, security, privacy, applicable requirements, access permissions, backups and restoration themselves. No maintenance, support or warranty is promised to the extent permitted by law. Mandatory rights and liability that cannot legally be excluded remain unaffected. These terms do not constitute a lawyer-confirmed assurance of enforceability.
