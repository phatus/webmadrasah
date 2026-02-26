import { PrismaClient } from '@prisma/client'

const prismaClientSingleton = () => {
    return new PrismaClient()
}

declare const globalThis: {
    prismaGlobalRefreshed: ReturnType<typeof prismaClientSingleton>
} & typeof global

const prisma = (globalThis.prismaGlobalRefreshed ?? prismaClientSingleton()) as any

export default prisma

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobalRefreshed = prisma
