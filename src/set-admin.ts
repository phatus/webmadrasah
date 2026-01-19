
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
    const username = "admin" // Target username

    console.log(`Updating role for user: ${username}...`)

    try {
        const user = await prisma.user.update({
            where: { username },
            data: { role: "ADMIN" }
        })
        console.log("Success! User updated:", user)
    } catch (e) {
        console.error("Error updating user:", e)
    } finally {
        await prisma.$disconnect()
    }
}

main()
