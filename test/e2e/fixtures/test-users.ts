import { LoginCredentials } from '../helpers/auth.helper';

/**
 * Test user credentials for E2E tests
 *
 * These credentials should match the values in .env.e2e
 * NEVER commit real production credentials to this file!
 */

export const primaryTestUser: LoginCredentials = {
  username: process.env.E2E_TEST_USERNAME || 'testuser',
  password: process.env.E2E_TEST_PASSWORD || 'testpassword',
  account: process.env.E2E_TEST_ACCOUNT || 'testaccount',
};

export const secondaryTestUser: LoginCredentials = {
  username: process.env.E2E_TEST_USERNAME_2 || 'testuser2',
  password: process.env.E2E_TEST_PASSWORD_2 || 'testpassword2',
  account: process.env.E2E_TEST_ACCOUNT_2 || 'testaccount2',
};

/**
 * Invalid credentials for testing error handling
 */
export const invalidTestUser: LoginCredentials = {
  username: 'invalid_user',
  password: 'invalid_password',
  account: 'invalid_account',
};
