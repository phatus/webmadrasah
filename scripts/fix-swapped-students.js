require('dotenv/config')
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
    console.log("🔍 Checking for swapped Student NIS and Name data in WebMadrasah DB...")

    const students = await prisma.student.findMany({
        select: { id: true, nis: true, name: true, class: true }
    })

    const swapped = students.filter(s => {
        const nisHasLetters = /[a-zA-Z]/.test(s.nis)
        const nameIsOnlyDigits = /^\d+$/.test(s.name.trim())
        const nameHasLetters = /[a-zA-Z]/.test(s.name)
        return nisHasLetters || (nameIsOnlyDigits && !nameHasLetters)
    })

    if (swapped.length === 0) {
        console.log("✅ Data NIS dan Nama siswa dalam kondisi baik (tidak ada data yang terbalik).")
        return
    }

    console.log(`⚠️  Ditemukan ${swapped.length} data siswa dengan NIS & Nama yang terbalik:`)
    for (const s of swapped) {
        console.log(`   - ID ${s.id} [Kelas ${s.class}]: NIS Saat Ini="${s.nis}" | Nama Saat Ini="${s.name}"`)
    }

    console.log("\n🔄 Memperbaiki & membalikkan data NIS & Nama...")

    let count = 0
    for (const s of swapped) {
        const correctNis = s.name.trim()
        const correctName = s.nis.trim()

        await prisma.student.update({
            where: { id: s.id },
            data: {
                nis: correctNis,
                name: correctName
            }
        })
        count++
    }

    console.log(`✅ Berhasil membetulkan ${count} data siswa!`)
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error("❌ Error fixing swapped student data:", e)
        await prisma.$disconnect()
        process.exit(1)
    })
