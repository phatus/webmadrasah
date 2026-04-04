import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Starting to add sample data...')

  // Hash password
  const password = await bcrypt.hash('password123', 10)

  // 1. Create Admin User
  const admin = await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      name: 'Administrator',
      password,
      role: 'ADMIN',
      bio: 'School administrator',
    },
  })
  console.log('✅ Admin user created:', admin.username)

  // 2. Create Categories
  const categories = ['News', 'Events', 'Academic', 'Sports', 'Arts']
  for (const catName of categories) {
    const slug = catName.toLowerCase()
    const category = await prisma.category.upsert({
      where: { slug },
      update: {},
      create: {
        name: catName,
        slug,
      },
    })
    console.log(`✅ Category created: ${category.name}`)
  }

  // 3. Create Teachers (no upsert since nip is not unique)
  const teachers = [
    { name: 'Budi Santoso', nip: '197001012000031', position: 'Guru Biology', subject: 'Biology' },
    { name: 'Siti Aminah', nip: '198502052012032', position: 'Guru Matematika', subject: 'Mathematics' },
    { name: 'Ahmad Wijaya', nip: '199003102015041', position: 'Guru Fisika', subject: 'Physics' },
  ]

  for (const teacher of teachers) {
    // Check if teacher with this NIP already exists
    const existing = await prisma.teacher.findFirst({
      where: { nip: teacher.nip }
    })

    if (existing) {
      console.log(`⏭️  Teacher already exists: ${teacher.name} (${teacher.nip})`)
    } else {
      const created = await prisma.teacher.create({
        data: teacher,
      })
      console.log(`✅ Teacher created: ${created.name}`)
    }
  }

  // 4. Create Sample Post
  const newsCategory = await prisma.category.findFirst({
    where: { slug: 'news' }
  })

  if (newsCategory && admin) {
    const post = await prisma.post.create({
      data: {
        title: 'Selamat Datang di Web Madrasah',
        slug: 'selamat-datang-di-web-madrasah',
        excerpt: 'Kami dengan senang hati mengumumkan peluncuran website resmi madrasah.',
        content: '<p>Kami dengan senang hati mengumumkan peluncuran website resmi madrasah. Website ini akan menjadi sumber informasi untuk semua kegiatan, pengumuman, dan berita terkini.</p><p>Fitur-fitur yang tersedia:</p><ul><li>Informasi akademik</li><li>Pengumuman resmi</li><li>Galeri kegiatan</li><li>Dan banyak lagi</li></ul>',
        published: true,
        authorId: admin.id,
        categoryId: newsCategory.id,
        metaTitle: 'Selamat Datang - Web Madrasah',
        metaDescription: 'Website resmi madrasah dengan informasi lengkap',
      },
    })
    console.log('✅ Post created:', post.title)
  }

  // 5. Create Page Content (Sejarah)
  const sejarahPage = await prisma.pageContent.upsert({
    where: { key: 'sejarah' },
    update: {},
    create: {
      key: 'sejarah',
      title: 'Sejarah Madrasah',
      content: '<h2>Sejarah Singkat</h2><p>Madrasah didirikan pada tahun 1990 dengan visi menjadi lembaga pendidikan Islam terdepan.</p><p>Seiring berjalannya waktu, kami terus berkembang untuk memberikan pendidikan terbaik.</p>',
    },
  })
  console.log('✅ Page content created:', sejarahPage.key)

  // 6. Create Announcement
  const announcement = await prisma.announcement.create({
    data: {
      title: 'Pengumuman Libur Tahun Baruan',
      content: 'Madrasah akan libur pada tanggal 1 Januari 2025. Segala kegiatan akademik dimulai kembali tanggal 2 Januari 2025.',
      type: 'INFO',
      isActive: true,
      expiresAt: new Date('2025-01-02'),
    },
  })
  console.log('✅ Announcement created:', announcement.title)

  console.log('\n🎉 Sample data added successfully!')

  // Summary
  const userCount = await prisma.user.count()
  const categoryCount = await prisma.category.count()
  const teacherCount = await prisma.teacher.count()
  const postCount = await prisma.post.count()
  const pageCount = await prisma.pageContent.count()
  const announcementCount = await prisma.announcement.count()

  console.log('\n📊 Database Summary:')
  console.log(`  Users: ${userCount}`)
  console.log(`  Categories: ${categoryCount}`)
  console.log(`  Teachers: ${teacherCount}`)
  console.log(`  Posts: ${postCount}`)
  console.log(`  Page Contents: ${pageCount}`)
  console.log(`  Announcements: ${announcementCount}`)
}

main()
  .then(async () => {
    await prisma.$disconnect()
    console.log('\n✅ Database connection closed')
  })
  .catch(async (e) => {
    console.error('❌ Error:', e)
    await prisma.$disconnect()
    process.exit(1)
  })
