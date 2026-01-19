
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    const data = await prisma.pageContent.findUnique({
        where: { key: 'visi-misi' }
    })
    console.log('Current Visi Misi Content:', JSON.stringify(data?.content, null, 2))
}

main()
