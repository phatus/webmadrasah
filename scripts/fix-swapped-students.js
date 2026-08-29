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

    console.log("\n🔄 Memperbaiki & membalikkan data NIS & Nama (Phase 1: Temporary Swap)...")

    const targets = []
    for (const s of swapped) {
        const finalNis = s.name.trim()
        const finalName = s.nis.trim()
        const tempNis = `__TEMP_SWAP_${s.id}_${Date.now()}__`

        try {
            await prisma.student.update({
                where: { id: s.id },
                data: {
                    nis: tempNis,
                    name: finalName
                }
            })
            targets.push({ id: s.id, finalNis, finalName })
        } catch (err) {
            console.error(`Failed temp swap for student ${s.id}:`, err)
        }
    }

    console.log("🔄 Menetapkan NIS & Nama akhir (Phase 2: Final Assignment)...")

    let count = 0
    let skippedCount = 0

    for (const t of targets) {
        const existing = await prisma.student.findFirst({
            where: {
                nis: t.finalNis,
                NOT: { id: t.id }
            }
        })

        if (existing) {
            const safeNis = `${t.finalNis}_DUP_${t.id}`
            await prisma.student.update({
                where: { id: t.id },
                data: { nis: safeNis }
            })
            skippedCount++
            console.log(`   - ID ${t.id}: NIS '${t.finalNis}' digunakan siswa ID ${existing.id}, diubah menjadi '${safeNis}'`)
        } else {
            await prisma.student.update({
                where: { id: t.id },
                data: { nis: t.finalNis }
            })
            count++
        }
    }

    console.log(`✅ Berhasil membetulkan ${count} data siswa!${skippedCount > 0 ? ` (${skippedCount} disesuaikan karena duplikat)` : ''}`)
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
