<div align="center">

<img src="public/rucio-logo.svg" alt="Rucio" width="220" />

# Rucio WebUI

**The next-generation web interface for the [Rucio](https://rucio.cern.ch/) scientific data management system.**

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-149eca?logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178c6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3-38bdf8?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Storybook](https://img.shields.io/badge/Storybook-10-ff4785?logo=storybook&logoColor=white)](https://storybook.js.org/)
[![License](https://img.shields.io/badge/license-Apache--2.0-blue.svg)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](#notes-for-contributors)

</div>

---

## Overview

The Rucio WebUI is the new generation of the web interface used for over a decade by Rucio communities. It is built for **scalability, maintainability, and a great user experience**, following a clean **hexagonal architecture** that keeps domain logic independent of the fast-moving JavaScript ecosystem.

Powered by **TypeScript**, **React 19**, and **Next.js 16**, the project layers a custom streaming SDK on top of the Rucio server so that large datasets flow into the UI responsively.

## Key Features

- **Streaming SDK** — A purpose-built SDK streams NDJSON data from the Rucio server directly into page components, processed off the main thread via Comlink web workers.
- **Strictly Typed** — End-to-end TypeScript with generics for code integrity and a fast developer feedback loop.
- **Hexagonal Architecture** — Domain entities, use cases, and ports are isolated from infrastructure adapters, keeping the core framework-agnostic.
- **Multiple Auth Methods** — UserPass, OIDC (OpenID Connect), and x509 certificate authentication.
- **Accessible & Responsive** — Designed and tested for accessibility (`jest-axe`) and usability across devices.
- **Component Library** — A reusable component library (atoms → features → pages) built with TailwindCSS and developed in Storybook.
- **Feature Toggles** — Dynamic toggles to enable or disable functionality per deployment.
- **Thoroughly Tested** — Unit, component, gateway, hook, API, and end-to-end (Playwright) test suites.

## Tech Stack

| Layer     | Technology                                                 |
| --------- | ---------------------------------------------------------- |
| Framework | Next.js 16 (App Router), React 19                          |
| Language  | TypeScript 5.7                                             |
| Styling   | TailwindCSS, Radix UI, class-variance-authority            |
| Data      | Custom streaming SDK, React Query, Comlink workers         |
| DI        | InversifyJS                                                |
| Auth      | NextAuth v5, iron-session                                  |
| Tooling   | Storybook 10, Jest, React Testing Library, Playwright, MSW |

## Architecture

The codebase follows a clean hexagonal architecture:

```text
src/
├── app/                    Next.js App Router pages, layouts and API routes
│   └── (rucio)/            Main app routes — dashboard, DIDs, RSEs, rules, subscriptions
├── lib/
│   ├── core/              Domain layer
│   │   ├── entity/        Domain models (Account, DID, RSE, Rule, Subscription, …)
│   │   ├── use-case/      Business logic
│   │   └── port/          Repository interfaces
│   ├── infrastructure/    Adapters
│   │   ├── data/          Repository implementations (Rucio server comms)
│   │   ├── auth/          UserPass / OIDC / x509 implementations
│   │   └── hooks/         React data-fetching hooks
│   └── sdk/               Streaming SDK (NDJSON, typed Rucio operations)
└── component-library/     Reusable UI — atoms, features, pages
```

![Clean Architecture Workflow](https://snipboard.io/2s0eDc.jpg)

See [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md) for the design system documentation.

## Getting Started

### Prerequisites

- **Node.js** 20+ and npm
- Access to a Rucio server (for full functionality)

### Installation

```bash
git clone https://github.com/rucio/webui.git
cd webui
npm install
```

### Configuration

Create a `.env.development.local` file from the template for local development. Key variables control Rucio server endpoints, authentication methods, feature toggles, and OIDC provider configuration.

To ensure `git blame` accurately reflects contributions, run:

```bash
git config blame.ignoreRevsFile .git-blame-ignore-revs
```

### Development

```bash
npm run dev          # start the dev server  → http://localhost:3000
npm run dev:https    # start with HTTPS
```

The page auto-updates as you edit files. Production builds use `npm run build` followed by `npm run start`.

### Component Development with Storybook

We use Storybook to develop and test components in isolation:

```bash
npm run storybook    # → http://localhost:6006
```

## Testing

The project has dedicated test suites, each runnable on its own:

```bash
npm test                 # run all unit/integration suites
npm run test:api         # API routes
npm run test:component   # React components
npm run test:a11y        # accessibility checks
npm run test:gateway     # gateway / data layer
npm run test:sdk         # streaming SDK
npm run test:hook        # React hooks
npm run test:e2e         # Playwright end-to-end tests
```

## Notes for Contributors

Contributions are welcome and appreciated! Please keep the following in mind:

- **Architecture first** — Respect the hexagonal boundaries. Domain logic belongs in `lib/core`; anything touching the network, framework, or browser belongs in `lib/infrastructure`. The core must never import from infrastructure.
- **Type everything** — Avoid `any`. New code should be fully typed; the SDK relies on generics for safety.
- **Code style** — Run `npm run lint` and `npm run prettier:check` before pushing. Use `npm run prettier:write` to auto-format.
- **Tests are expected** — Add or update tests in the relevant suite (`test/`) for any behavioural change. UI changes should include a Storybook story where applicable.
- **Run `git config blame.ignoreRevsFile .git-blame-ignore-revs`** once after cloning so bulk formatting commits don't pollute `git blame`.
- **Branches & PRs** — Branch off `main`. Reference the related issue in your branch name and commits (e.g. `fix(rules): ... for #767`). Keep commits atomic and use [Conventional Commits](https://www.conventionalcommits.org/).
- **Open an issue first** for significant features so the direction can be discussed with the community.

PR merging in [rucio/webui](https://github.com/rucio/webui/) is handled by [Mayank Sharma](https://github.com/maany).

## Roadmap

- **Optimizing streaming pipelines** — Improve background-thread performance, minimize errors, and optimize resource use.
- **Design system maturity** — A cohesive color palette, theming, and component design system across all views.
- **UI expansion** — Build new views with the community based on user stories and a comprehensive UX plan.
- **Server endpoint expansion** — Extend Rucio server endpoints, including dedicated endpoints for complex multi-source use cases.
- **End-to-end testing** — Broaden Playwright coverage against live Rucio servers.

## Community & Support

- Rucio project site: [rucio.cern.ch](https://rucio.cern.ch/)
- Documentation: [rucio.cern.ch/documentation](https://rucio.cern.ch/documentation/)
- Issues & discussion: [github.com/rucio/webui/issues](https://github.com/rucio/webui/issues)

## License

This project is licensed under the **Apache License 2.0** — see the [LICENSE](LICENSE) file for details.
