
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('Checking Prisma Client for Teacher model...')
    // @ts-ignore
    if (prisma.teacher) {
        console.log('Teacher model exists in Prisma Client!')
        // @ts-ignore
        const count = await prisma.teacher.count()
        console.log('Teacher count:', count)
    } else {
        console.error('ERROR: Teacher model DOES NOT exist in Prisma Client.')
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
