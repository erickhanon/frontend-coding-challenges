# The Harry Potter App

<p align="center">
  <img src="public/harry-potter.svg" alt="The Harry Potter App mark" width="96" />
</p>

<p align="center">
  A React + TanStack Router character browser built for the Harry Potter frontend code challenge.
</p>

<p align="center">
  <strong>Route loaders</strong> | <strong>React Query caching</strong> |
  <strong>URL filters</strong> | <strong>Persistent favorites</strong> |
  <strong>Typed detail routes</strong>
</p>

## Preview

The app follows the provided visual reference: house selection, a character grid, favorite actions,
filtering, and a two-column character detail page.

![Harry Potter app layout preview](public/screenshots.gif)

## What This Project Implements

This repository started as a partially implemented frontend challenge. The finished app now covers
the challenge requirements and fixes the important data-flow bugs that would otherwise cause stale
or misleading UI.

| Area               | Implementation                                                                 |
| ------------------ | ------------------------------------------------------------------------------ |
| Character list     | Fetches all characters or characters scoped to the selected house              |
| House preference   | Preserves the difference between "not selected yet" and "show all characters"  |
| Filters            | Stores active list filter in the URL with safe validation                      |
| Favorites          | Persists only favorite character IDs in Zustand/localStorage                   |
| Detail page        | Adds `/characters/$characterId` with loader-prefetched data                    |
| Not found          | Handles empty single-character API responses with TanStack Router `notFound()` |
| Interaction safety | Favorite buttons do not trigger card navigation                                |
| Missing data       | Renders `UNKNOWN` for absent facts and `NONE` for empty alternate lists        |

## Core Features

- Choose a Hogwarts house or show all characters.
- Browse a responsive character grid.
- Filter characters by all, students, staff, or favorites.
- Favorite and unfavorite characters with local persistence.
- Open a character profile through a typed route.
- Prefetch detail data before rendering the detail page.
- Render all challenge-required detail sections.
- Handle missing or invalid API data without breaking the UI.

## Detail Page

The character detail route renders:

```text
Basic Information:
- species
- gender
- date of birth
- ancestry
- eye color
- hair color

Magical Information:
- wizard/witch status
- patronus

Hogwarts:
- student status
- staff status

Portrayed By:
- actor name
- alternate actors
```

The route uses the same `CharacterCard` presentation for the portrait and favorite action, plus the
shared `InfoSection` primitives for grouped detail content.

## Data Flow

```text
Character card click
  ->
TanStack Router navigates to /characters/$characterId
  ->
Route loader receives characterId
  ->
queryClient.ensureQueryData(characterQueryOptions(characterId))
  ->
React Query fetches /api/character/{id}
  ->
API returns an array
  ->
fetchCharacter() returns the first item or null
  ->
Empty array triggers route notFound()
  ->
Detail component reads the same query key
  ->
Presentation helpers format optional values
  ->
Detail UI renders
```

The loader and component both reuse the same React Query options factory:

```ts
export const characterQueryOptions = (characterId: string) =>
  queryOptions({
    queryKey: ["character", { characterId }] as const,
    queryFn: () => fetchCharacter(characterId),
    staleTime: Infinity,
  });
```

That shared query key prevents duplicate detail fetches after the loader has populated the cache.

## Missing Data Policy

The Harry Potter API contains optional and sometimes empty fields. The UI keeps those states
meaningful instead of flattening everything into one fallback.

| API state               | UI value  | Meaning                               |
| ----------------------- | --------- | ------------------------------------- |
| Missing scalar value    | `UNKNOWN` | The API did not provide this fact     |
| Missing or invalid date | `UNKNOWN` | The date cannot be displayed safely   |
| Missing boolean         | `UNKNOWN` | The API did not say yes or no         |
| Boolean `false`         | `NO`      | The API explicitly says no            |
| Empty alternate names   | `NONE`    | There are no alternate names to show  |
| Empty alternate actors  | `NONE`    | There are no alternate actors to show |

This distinction matters most for booleans: `false` and `undefined` are different domain states.

## Architecture

The app keeps responsibilities separated:

```text
TanStack Router
- route params
- loader execution
- not-found behavior
- typed navigation

React Query
- server-state fetching
- cache keys
- loader/component cache reuse

Zustand
- preferred house
- favorite character IDs
- localStorage persistence

Presentation helpers
- date formatting
- UNKNOWN/NONE fallbacks
- list and boolean display values

Components
- layout
- cards
- filters
- interaction controls
```

## API

The app uses the public Harry Potter API.

| Endpoint                        | Purpose                         |
| ------------------------------- | ------------------------------- |
| `/api/characters`               | Fetch all characters            |
| `/api/characters/house/{house}` | Fetch characters by house       |
| `/api/character/{id}`           | Fetch one character as an array |

The single-character endpoint returns an array, so the app intentionally uses the first item as the
character and treats an empty array as not found.

## Tech Stack

- React 19
- TypeScript
- Vite
- Tailwind CSS v4
- TanStack Router
- TanStack React Query
- Zustand with persistence middleware
- Vitest
- React Testing Library
- Lucide React icons

## Getting Started

Install dependencies:

```bash
pnpm install
```

Create a local environment file:

```bash
cp .env.example .env
```

The required variable is:

```bash
VITE_HARRY_POTTER_API_URL=https://hp-api.onrender.com/api
```

Start the development server:

```bash
pnpm dev
```

Open:

```text
http://localhost:3001
```

## Scripts

| Command              | Description                         |
| -------------------- | ----------------------------------- |
| `pnpm dev`           | Start Vite on port 3001             |
| `pnpm build`         | Run TypeScript and production build |
| `pnpm preview`       | Preview the production build        |
| `pnpm typecheck`     | Run TypeScript only                 |
| `pnpm test`          | Run the Vitest suite                |
| `pnpm test:watch`    | Run Vitest in watch mode            |
| `pnpm test:coverage` | Run tests with coverage             |

## Testing Strategy

The tests focus on behavior instead of implementation details.

- API helpers normalize the single-character array response.
- Query keys separate list scopes and detail characters.
- Store tests verify favorite ID persistence and old persisted-state compatibility.
- Filter tests verify URL search-param validation and scoped favorite filtering.
- Route tests verify loader prefetching, cache reuse, not-found behavior, card navigation, favorite
  isolation, and back navigation.
- Detail tests verify all README-required fields and missing-data fallbacks.

Run the full suite:

```bash
pnpm test
```

Run the production build:

```bash
pnpm build
```

## Project Structure

```text
src/
  lib/
    api/              API clients and React Query option factories
    components/       Shared UI primitives
    constants/        Character, filter, and house constants
    hooks/            Zustand app store
    utils/            Formatting and filtering helpers
  routes/
    (characters)/     Character list and detail routes
    -components/      Root-level route components
  test/               Test fixtures and route render helper
```

## Challenge Notes

- Favorites intentionally persist IDs only, not full character objects.
- The favorite filter is scoped to the currently selected house or global character list.
- Invalid filter search params fall back to the all-characters view.
- `UNKNOWN` and `NONE` are intentionally different display states.
