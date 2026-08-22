import 'dotenv/config'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const dummyStudents = [
    // Kelas 7A
    { nis: '24250701', name: 'Ahmad Fauzi', class: '7A', status: 'AKTIF' },
    { nis: '24250702', name: 'Aisyah Putri Rahmawati', class: '7A', status: 'AKTIF' },
    { nis: '24250703', name: 'Anisa Nur Hikmah', class: '7A', status: 'AKTIF' },
    { nis: '24250704', name: 'Bima Arya Pratama', class: '7A', status: 'AKTIF' },
    { nis: '24250705', name: 'Dewa Rendy Saputra', class: '7A', status: 'AKTIF' },
    { nis: '24250706', name: 'Fitri Nur Azizah', class: '7A', status: 'AKTIF' },

    // Kelas 7B
    { nis: '24250711', name: 'Gilang Ramadhan', class: '7B', status: 'AKTIF' },
    { nis: '24250712', name: 'Hafizah Naura Salsabila', class: '7B', status: 'AKTIF' },
    { nis: '24250713', name: 'Ibrahim Maulana', class: '7B', status: 'AKTIF' },
    { nis: '24250714', name: 'Intan Nuraini', class: '7B', status: 'AKTIF' },
    { nis: '24250715', name: 'Kevin Kurniawan', class: '7B', status: 'AKTIF' },
    { nis: '24250716', name: 'Laila Zahra', class: '7B', status: 'AKTIF' },

    // Kelas 8A
    { nis: '23240801', name: 'Muhammad Rizky Pratama', class: '8A', status: 'AKTIF' },
    { nis: '23240802', name: 'Nabila Syakira', class: '8A', status: 'AKTIF' },
    { nis: '23240803', name: 'Rahmat Hidayatullah', class: '8A', status: 'AKTIF' },
    { nis: '23240804', name: 'Siti Rahmawati', class: '8A', status: 'AKTIF' },
    { nis: '23240805', name: 'Tri Utami', class: '8A', status: 'AKTIF' },
    { nis: '23240806', name: 'Zaky Mubarok', class: '8A', status: 'AKTIF' },
]

async function main() {
    console.log("🌱 Seeding dummy students for 3 classes (7A, 7B, 8A)...")

    let count = 0
    for (const student of dummyStudents) {
        await prisma.student.upsert({
            where: { nis: student.nis },
            update: {
                name: student.name,
                class: student.class,
                status: student.status,
            },
            create: student,
        })
        count++
    }

    console.log(`✅ Success! Seeded/Updated ${count} students across 3 classes: 7A, 7B, and 8A.`)
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error("❌ Error seeding students:", e)
        await prisma.$disconnect()
        process.exit(1)
    })
