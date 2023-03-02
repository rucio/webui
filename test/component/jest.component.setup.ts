import '@testing-library/jest-dom/extend-expect'
import "reflect-metadata"
import fetchMock from 'jest-fetch-mock'
import "@inrupt/jest-jsdom-polyfills"
fetchMock.enableMocks()

import { loadEnvConfig } from '@next/env'

export default async () => {
    const projectDir = process.cwd()
    loadEnvConfig(projectDir)
  }