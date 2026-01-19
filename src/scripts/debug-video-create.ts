
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('Attempting to create a video...')
    try {
        const result = await prisma.video.create({
            data: {
                title: 'Debug Video',
                url: 'https://www.youtube.com/watch?v=debug123',
                youtubeId: 'debug123'
            }
        })
        console.log('Success:', result)
    } catch (error) {
        console.error('FAILED TO CREATE VIDEO:', error)
    } finally {
        await prisma.$disconnect()
    }
}

main()
