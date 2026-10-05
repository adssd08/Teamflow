import 'dotenv/config'

export const env = {
    PORT: Number(process.env.PORT || 3000),
    DB_URL: process.env.DATABASE_URL
}