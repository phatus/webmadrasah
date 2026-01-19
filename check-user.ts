
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    const userCount = await prisma.user.count()
    console.log(`Total users: ${userCount}`)

    const admin = await prisma.user.findUnique({
        where: { username: 'admin' },
    })

    if (admin) {
        console.log('Admin user found:', admin.username)
        console.log('Password hash:', admin.password.substring(0, 10) + '...')
    } else {
        console.log('Admin user NOT found')
    }
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
