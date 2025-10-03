import dotenv from 'dotenv';
dotenv.config()

export const Constantdata={
    PORT_NO:process.env.port,
    POSTGRES_URL:process.env.postgresqlurl


}