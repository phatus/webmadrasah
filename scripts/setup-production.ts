#!/usr/bin/env tsx

/**
 * Production Setup Script
 *
 * Run this after deploying to production to:
 * 1. Push Prisma schema to database
 * 2. Create admin user (if not exists)
 * 3. Seed initial data (categories, etc.)
 *
 * Usage: npx tsx scripts/setup-production.ts
 */

import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function setupProduction() {
  console.log('🚀 Starting production setup...\n')

  try {
    // 1. Push Prisma schema
    console.log('📦 Running Prisma migrate deploy...')
    // Note: This is informational - you need to run this command separately on production
    console.log('   (Run manually on production: npx prisma migrate deploy)\n')

    // 2. Create admin user if not exists
    console.log('👤 Creating admin user...')
    const adminUsername = 'admin'
    const adminPassword = 'WebMadrasah@2024' // CHANGE THIS IMMEDIATELY after first login!

    const existingAdmin = await prisma.user.findUnique({
      where: { username: adminUsername }
    })

    if (existingAdmin) {
      console.log(`   ℹ️  Admin user '${adminUsername}' already exists (ID: ${existingAdmin.id})`)
      console.log(`   🔐 Change password immediately after login!`)
    } else {
      const hashedPassword = await bcrypt.hash(adminPassword, 12)
      const admin = await prisma.user.create({
        data: {
          username: adminUsername,
          name: 'Administrator',
          password: hashedPassword,
          role: 'ADMIN'
        }
      })
      console.log(`   ✅ Admin user created: ${adminUsername} (ID: ${admin.id})`)
      console.log(`   🔐 Default password: ${adminPassword} - CHANGE IMMEDIATELY!`)
    }

    // 3. Create default categories if empty
    console.log('\n📁 Checking default categories...')
    const categoryCount = await prisma.category.count()

    if (categoryCount === 0) {
      console.log('   Creating default categories...')
      const defaultCategories = [
        { name: 'Berita', slug: 'berita' },
        { name: 'Pengumuman', slug: 'pengumuman' },
        { name: 'Kegiatan', slug: 'kegiatan' },
        { name: 'Prestasi', slug: 'prestasi' },
        { name: 'Informasi', slug: 'informasi' }
      ]

      for (const cat of defaultCategories) {
        await prisma.category.create({
          data: cat
        })
        console.log(`   ✅ Created category: ${cat.name}`)
      }
    } else {
      console.log(`   ℹ️  Found ${categoryCount} categories already exists`)
    }

    // 4. Check if AppSettings exist
    console.log('\n⚙️  Checking application settings...')
    const settingsCount = await prisma.appSetting.count()

    if (settingsCount === 0) {
      console.log('   Creating default settings...')
      const defaultSettings = [
        { key: 'site_name', value: 'MTsN 1 Pacitan' },
        { key: 'site_description', value: 'Website Resmi MTsN 1 Pacitan - Madrasah Hebat Bermartabat' },
        { key: 'site_logo', value: '' },
        { key: 'contact_email', value: 'info@mtsn1pacitan.sch.id' },
        { key: 'contact_phone', value: '' },
        { key: 'contact_address', value: '' },
        { key: 'social_facebook', value: '' },
        { key: 'social_instagram', value: '' },
        { key: 'social_youtube', value: '' },
        { key: 'headmaster_name', value: '' },
        { key: 'map_embed', value: '' }
      ]

      for (const setting of defaultSettings) {
        await prisma.appSetting.upsert({
          where: { key: setting.key },
          update: setting,
          create: setting
        })
      }
      console.log('   ✅ Default settings created')
    } else {
      console.log(`   ℹ️  Found ${settingsCount} settings already exists`)
    }

    // 5. Summary
    console.log('\n✅ Production setup complete!\n')
    console.log('📋 Next steps:')
    console.log('1. Login to admin panel with admin / WebMadrasah@2024')
    console.log('2. Change admin password immediately')
    console.log('3. Configure site settings at /dashboard/settings')
    console.log('4. Create initial content (posts, announcements, etc.)')
    console.log('5. Test all functionality')
    console.log('\n🔐 Security reminder:')
    console.log('- Enable 2FA if available')
    console.log('- Review audit logs at /dashboard/audit')
    console.log('- Set up regular backups')
    console.log('\n')

  } catch (error) {
    console.error('❌ Setup failed:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  setupProduction().catch(console.error)
}

export { setupProduction, prisma }
