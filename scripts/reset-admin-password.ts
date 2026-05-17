import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    const username = 'admin'
    const newPassword = process.argv[2] || 'WebMadrasah@2026'

    console.log(`--- Resetting Admin Password ---`)
    console.log(`Username: ${username}`)
    console.log(`New Password: ${newPassword}`)

    try {
        const existingUser = await prisma.user.findUnique({
            where: { username }
        })

        if (!existingUser) {
            console.log(`User with username "${username}" not found. Creating a new one instead...`)
            const hashedPassword = await bcrypt.hash(newPassword, 12)
            const newUser = await prisma.user.create({
                data: {
                    username,
                    name: 'Administrator',
                    password: hashedPassword,
                    role: 'ADMIN'
                }
            })
            console.log(`✅ Success: New admin user created successfully!`)
            return
        }

        const hashedPassword = await bcrypt.hash(newPassword, 12)
        const updatedUser = await prisma.user.update({
            where: { username },
            data: {
                password: hashedPassword
            }
        })

        console.log(`✅ Success: Password for admin user "${username}" has been reset!`)
    } catch (error) {
        console.error('❌ Failed to reset password:', error)
    } finally {
        await prisma.$disconnect()
    }
}

main()
