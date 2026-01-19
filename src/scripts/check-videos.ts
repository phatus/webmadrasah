
import { PrismaClient } from '@prisma/client'
import { getVideos } from '../actions/video'

const prisma = new PrismaClient()

async function main() {
    console.log('Checking direct Prisma access...')
    const count = await prisma.video.count()
    console.log('Video count:', count)
    const allVideos = await prisma.video.findMany()
    console.log('All Videos:', allVideos)

    console.log('Checking getVideos action...')
    const actionVideos = await getVideos(3)
    console.log('Action Videos:', actionVideos)
}

main()
