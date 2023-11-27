## Project Specification: Rucio WebUI

### Overview

The Rucio WebUI is the new generation of the original webui used for the last decade by the Rucio communities. This project aims to enhance user experience and scalability through a clean architecture and hexagonal design. Leveraging TypeScript, ReactJS, and NextJS, this project ensures framework independence in the dynamic Javascript ecosystem.

### Key Features

- **SDK for Streaming**: Developed SDK facilitates seamless data streaming from the Rucio server to page components, ensuring a responsive user interface.

- **Typed in TypeScript with Generics**: Strict typing ensures code integrity and enhances development efficiency.

- **Accessibility and Responsiveness**: The WebUI is designed with accessibility and responsiveness in mind, ensuring usability across various devices.

- **Testing and Stability**: The project boasts extensive testing, ensuring robustness and reliability in all components.

- **Feature Toggles**: Dynamic feature toggles provide flexibility in enabling or disabling specific functionalities as needed.

- **Component Library**: Utilizing Storybooks, the WebUI incorporates a component library built with TailwindCSS, enhancing development speed and consistency.

### Future Plans

1. **Optimizing Streaming Pipelines**: Enhance the performance of background threads for improved streaming, focusing on minimizing errors and optimizing resource utilization.

2. **Design System Development**: Establish a cohesive color palette, theme, and design system for uniformity across all components.

3. **UI Expansion and Enhancement**: Collaborate with the community to identify and implement new views based on user stories, creating a comprehensive user journey and UX plan. Iterate on prototypes for seamless integration into the WebUI.

4. **Server Endpoint Expansion**: Extend Rucio Server endpoints to better align with WebUI requirements. For complex use cases involving data from multiple endpoints, create dedicated server endpoints to streamline data retrieval.

5. **End to End Testing**: Add Playright for end to end testing of the WebUI with actual Rucio servers running the back.

By contributing to the Rucio WebUI project, you play a crucial role in shaping the future of a scalable, resilient, and user-friendly interface for the Rucio ecosystem. Join us in this exciting journey to enhance data management and user interaction.


## Getting Started

### Storybooks

We use storybooks for developing and testing components. To run storybooks, run the following command:

```bash
npm run storybook
```

As you live edit the components, you would need to compile TypeScript. To do so, run the following command in a separate terminal:

```bash
npm run build-tailwind:watch
```

### Tests
There are 4 test suites, each with their own command:

```bash
npm run test:api
```

```bash
npm run test:component
```

```bash
npm run test:gateway
```

### Development
To start the development

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.ts`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Architecture

![Clean Architecture Workflow](https://snipboard.io/2s0eDc.jpg)