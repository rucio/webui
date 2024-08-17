import '@testing-library/jest-dom/extend-expect'
import "reflect-metadata"
import fetchMock from 'jest-fetch-mock'
import "@inrupt/jest-jsdom-polyfills"
fetchMock.enableMocks()

import { loadEnvConfig } from '@next/env'

const noop = () => {};
Object.defineProperty(window, 'scrollTo', { value: noop, writable: true });

const setupTests = async () => {
    const projectDir = process.cwd()
    loadEnvConfig(projectDir)
    
}

export default setupTests