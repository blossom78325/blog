import dotenv from 'dotenv'

dotenv.config()

export const config: { [index: string]: string } = {
    MONGO_URI: process.env.MONGO_URI!,
    JWT_SECRET: process.env.JWT_SECRET!,
    PORT: process.env.PORT!
}
