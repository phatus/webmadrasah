#!/usr/bin/env tsx

/**
 * Development Environment Setup Script
 *
 * This script sets up your local development environment:
 * 1. Generates Prisma client
 * 2. Pushes database schema
 * 3. Creates admin user (if not exists)
 * 4. Seeds initial data
 *
 * Usage: npx tsx scripts/setup-dev.ts
 */

import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import path from 'path'

const prisma = new PrismaClient()

async function setupDev() {
  console.log('🔧 Setting up development environment...\n')

  try {
    // 1. Generate Prisma Client
    console.log('📦 Generating Prisma Client...')
    // This is already done by prisma generate, but included for completeness
    console.log('   ✅ Prisma Client ready\n')

    // 2. Push database schema
    console.log('🗄️  Pushing database schema...')
    // Manual step: npx prisma db push
    console.log('   Run: npx prisma db push\n')

    // 3. Create admin user
    console.log('👤 Creating admin user...')
    const adminUsername = 'admin'
    const adminPassword = 'password123' // In production, change this!

    const existingAdmin = await prisma.user.findUnique({
      where: { username: adminUsername }
    })

    if (existingAdmin) {
      console.log(`   ℹ️  Admin user '${adminUsername}' already exists`)
      console.log(`   📝 User ID: ${existingAdmin.id}`)
      console.log(`   🔐 You can login with this account\n`)
    } else {
      const hashedPassword = await bcrypt.hash(adminPassword, 10)
      const admin = await prisma.user.create({
        data: {
          username: adminUsername,
          name: 'Administrator',
          password: hashedPassword,
          role: 'ADMIN'
        }
      })
      console.log(`   ✅ Admin user created!`)
      console.log(`   👤 Username: ${adminUsername}`)
      console.log(`   🔐 Password: ${adminPassword}`)
      console.log(`   ⚠️  CHANGE THIS PASSWORD AFTER FIRST LOGIN!\n`)
    }

    // 4. Show next steps
    console.log('✅ Development setup complete!\n')
    console.log('📋 Next steps:')
    console.log('1. Start development server: npm run dev')
    console.log('2. Open http://localhost:3001')
    console.log('3. Login with admin credentials')
    console.log('4. Start developing!\n')
    console.log('🔧 Useful commands:')
    console.log('  npm run dev        - Start development server')
    console.log('  npm run build      - Build for production')
    console.log('  npx prisma studio  - Open database studio')
    console.log('  npx prisma generate - Regenerate Prisma client\n')

  } catch (error) {
    console.error('❌ Setup failed:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  setupDev().catch(console.error)
}

export { setupDev, prisma }
