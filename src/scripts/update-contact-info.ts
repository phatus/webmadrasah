
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    const settings = [
        { key: 'contact_address', value: 'R34X+6XQ, Jl. H. Samanhudi, Palihan, Pucangsewu, Kec. Pacitan, Kabupaten Pacitan, Jawa Timur 63511' },
        { key: 'contact_phone', value: '(0357) 881303' },
        { key: 'contact_email', value: 'info@mtsnpacitan.sch.id' },
        { key: 'site_description', value: 'Mewujudkan Madrasah yang Islami, Berkualitas, dan Berwawasan Lingkungan.' } // Updated description based on common vision
    ]

    console.log('Updating settings...')

    for (const setting of settings) {
        await prisma.appSetting.upsert({
            where: { key: setting.key },
            update: { value: setting.value },
            create: { key: setting.key, value: setting.value }
        })
        console.log(`Updated ${setting.key} -> ${setting.value}`)
    }
}

main()
    .catch(e => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
