import prisma from "@/lib/db"
import bcrypt from "bcryptjs"
import { NextResponse } from "next/server"

export async function GET() {
    try {
        const password = await bcrypt.hash("password123", 10)
        const user = await prisma.user.upsert({
            where: { username: "admin" },
            update: {},
            create: {
                username: "admin",
                name: "Administrator",
                password,
            },
        })
        return NextResponse.json({ message: "Admin created", user })
    } catch (error) {
        return NextResponse.json({ error: String(error) }, { status: 500 })
    }
}
