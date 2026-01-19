import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
})

async function main() {
    console.log('Connecting...')
    await prisma.$connect()
    console.log('Connected!')
    const count = await prisma.user.count()
    console.log('User count:', count)
}

main()
    .catch(e => {
        console.error('Error:', e)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
