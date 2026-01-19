
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    await prisma.appSetting.upsert({
        where: { key: 'site_logo' },
        update: { value: '/images/logo.png' },
        create: { key: 'site_logo', value: '/images/logo.png' },
    })
    console.log('Logo updated to /images/logo.png')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
