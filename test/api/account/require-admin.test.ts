const redirectMock = jest.fn((url: string) => {
    throw new Error(`NEXT_REDIRECT:${url}`);
});
jest.mock('next/navigation', () => ({ redirect: (url: string) => redirectMock(url) }));

const mockGetSessionUser = jest.fn();
jest.mock('@/lib/infrastructure/auth/nextauth-session-utils', () => ({ getSessionUser: () => mockGetSessionUser() }));

import { requireAdmin, requireSelfOrAdmin } from '@/lib/infrastructure/auth/require-admin';
import { Role } from '@/lib/core/entity/auth-models';

const admin = { isLoggedIn: true, role: Role.ADMIN, rucioAccount: 'root' };
const user = { isLoggedIn: true, role: Role.USER, rucioAccount: 'jdoe' };

describe('requireAdmin', () => {
    beforeEach(() => redirectMock.mockClear());
    it('returns the admin user', async () => {
        mockGetSessionUser.mockResolvedValue(admin);
        await expect(requireAdmin()).resolves.toBe(admin);
        expect(redirectMock).not.toHaveBeenCalled();
    });
    it('redirects a non-admin to /', async () => {
        mockGetSessionUser.mockResolvedValue(user);
        await expect(requireAdmin()).rejects.toThrow('NEXT_REDIRECT:/');
    });
    it('redirects a logged-out visitor to /', async () => {
        mockGetSessionUser.mockResolvedValue(undefined);
        await expect(requireAdmin()).rejects.toThrow('NEXT_REDIRECT:/');
    });
});

describe('requireSelfOrAdmin', () => {
    beforeEach(() => redirectMock.mockClear());
    it('lets a user view their own account', async () => {
        mockGetSessionUser.mockResolvedValue(user);
        await expect(requireSelfOrAdmin('jdoe')).resolves.toBe(user);
    });
    it('lets an admin view any account', async () => {
        mockGetSessionUser.mockResolvedValue(admin);
        await expect(requireSelfOrAdmin('jdoe')).resolves.toBe(admin);
    });
    it('redirects a non-admin on another account to their own page', async () => {
        mockGetSessionUser.mockResolvedValue(user);
        await expect(requireSelfOrAdmin('root')).rejects.toThrow('NEXT_REDIRECT:/account/jdoe');
    });
    it('redirects a logged-out visitor to /', async () => {
        mockGetSessionUser.mockResolvedValue(undefined);
        await expect(requireSelfOrAdmin('jdoe')).rejects.toThrow('NEXT_REDIRECT:/');
    });
});
