import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
    console.log("Start seeding facilities...")

    const facilities = [
        {
            name: "Laboratorium Komputer",
            description: "Fasilitas lab komputer yang lengkap untuk menunjang pembelajaran TIK dan ujian berbasis komputer (CBT).",
            image: "https://images.unsplash.com/photo-1571260899304-425eee4c7efc?q=80&w=800&auto=format&fit=crop"
        },
        {
            name: "Laboratorium IPA",
            description: "Tempat praktikum sains (Fisika, Kimia, Biologi) dengan peralatan yang memadai untuk eksplorasi ilmiah siswa.",
            image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?q=80&w=800&auto=format&fit=crop"
        },
        {
            name: "Smart TV / LED TV di Setiap Kelas",
            description: "Setiap ruang kelas dilengkapi dengan Smart TV/LED TV untuk mendukung pembelajaran digital dan interaktif.",
            image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=800&auto=format&fit=crop"
        },
        {
            name: "WiFi di Setiap Kelas",
            description: "Akses internet gratis dan cepat tersedia di setiap ruang kelas untuk memudahkan akses sumber belajar online.",
            image: "https://images.unsplash.com/photo-1563770095-39d468f9a51d?q=80&w=800&auto=format&fit=crop"
        },
        {
            name: "Perpustakaan",
            description: "Koleksi buku lengkap dengan suasana membaca yang tenang, menumbuhkan minat baca siswa.",
            image: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?q=80&w=800&auto=format&fit=crop"
        },
        {
            name: "Ruang Kelas Nyaman",
            description: "Ruang belajar dengan ventilasi dan pencahayaan yang baik, menciptakan suasana kondusif untuk belajar.",
            image: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?q=80&w=800&auto=format&fit=crop"
        },
        {
            name: "Musola Kecil",
            description: "Tempat ibadah yang bersih dan nyaman untuk kegiatan sholat berjamaah dan kegiatan keagamaan terbatas.",
            image: "https://images.unsplash.com/photo-1542436737-29bd9e0f68d3?q=80&w=800&auto=format&fit=crop"
        },
        {
            name: "Kantin Bersih",
            description: "Menyediakan makanan dan minuman higienis dengan harga terjangkau untuk menjaga kesehatan warga madrasah.",
            image: "https://images.unsplash.com/photo-1565538810643-b5bdb714032a?q=80&w=800&auto=format&fit=crop"
        }
    ]

    console.log(`Clearing existing facilities...`)
    await prisma.facility.deleteMany()

    console.log(`Seeding ${facilities.length} facilities...`)
    for (const facility of facilities) {
        await prisma.facility.create({
            data: facility
        })
    }

    console.log("Seeding finished.")
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
