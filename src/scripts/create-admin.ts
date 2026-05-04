import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    const username = process.argv[2] || 'admin'
    const password = process.argv[3] || 'password123'
    const name = process.argv[4] || 'Administrator'

    console.log(`--- Creating Admin User ---`)
    console.log(`Username: ${username}`)
    console.log(`Name: ${name}`)

    try {
        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { username }
        })

        if (existingUser) {
            console.error(`Error: User with username "${username}" already exists.`)
            process.exit(1)
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const user = await prisma.user.create({
            data: {
                username,
                password: hashedPassword,
                name,
                role: 'ADMIN'
            }
        })

        console.log(`\nSUCCESS: Admin user created successfully!`)
        console.log(`ID: ${user.id}`)
        console.log(`You can now login with:`)
        console.log(`User: ${username}`)
        console.log(`Pass: ${password}`)
    } catch (error) {
        console.error('\nFAILED to create admin user:', error)
    } finally {
        await prisma.$disconnect()
    }
}

main()
