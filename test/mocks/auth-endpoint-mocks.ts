import { rest } from 'msw'

export const handlers = [
    rest.get('/api/auth/userpass', (req, res, ctx) => {
        return res(
            ctx.status(200),
            ctx.json({
                rucioIdentity: 'ddmlab',
            }),
        )
    }),
]