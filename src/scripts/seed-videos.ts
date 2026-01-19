
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    const videos = [
        {
            title: 'Surga Wisata_MTSN 1 PACITAN',
            url: 'https://www.youtube.com/watch?v=_Y7fEe_3Cas',
            youtubeId: '_Y7fEe_3Cas'
        },
        {
            title: 'MTS NEGERI 1 PACITAN',
            url: 'https://www.youtube.com/watch?v=HpuK-p6sN44',
            youtubeId: 'HpuK-p6sN44'
        },
        {
            title: 'DEBAT CALON OSIS MTsN 1 PACITAN MASA BAKTI 2025 MT',
            url: 'https://www.youtube.com/watch?v=-q19kG6lR7w',
            youtubeId: '-q19kG6lR7w'
        }
    ]

    console.log('Seeding videos...')

    for (const video of videos) {
        await prisma.video.create({
            data: video
        })
    }

    console.log('Seeding complete.')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
