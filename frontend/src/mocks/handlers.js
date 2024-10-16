import { rest } from 'msw'

const userAdmin1 = {
    "id": 1,
    "username": "admin1",
    "authority": {
        "authority": "ADMIN"
    }
};

export const handlers = [
    rest.delete('*/:id', (req, res, ctx) => {
        return res(
            ctx.status(200),
            ctx.json({
                message: "Entity deleted"
            }),
        )
    }),

    rest.get('*/api/v1/users', (req, res, ctx) => {
        return res(
            ctx.status(200),
            ctx.json([
                userAdmin1
            ]),
        )
    }),
]