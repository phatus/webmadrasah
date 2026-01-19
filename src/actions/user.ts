'use server'

import prisma from "@/lib/db"
import { auth } from "@/auth"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import bcrypt from "bcryptjs"
import { z } from "zod"

const UserSchema = z.object({
    name: z.string().min(1, "Nama wajib diisi"),
    username: z.string().min(3, "Username minimal 3 karakter"),
    password: z.string().min(6, "Password minimal 6 karakter").optional(),
    bio: z.string().optional(),
    image: z.string().optional(),
    role: z.string().default("EDITOR"),
})

export async function getUsers() {
    return await prisma.user.findMany({ orderBy: { createdAt: 'desc' } })
}

export async function getUser(id: number) {
    return await prisma.user.findUnique({ where: { id } })
}

export async function createUser(prevState: any, formData: FormData) {
    const session = await auth()
    if (!session || !session.user || session.user.role !== "ADMIN") return { error: "Unauthorized: Admins only" }

    const name = formData.get("name") as string
    const username = formData.get("username") as string
    const passwordRaw = formData.get("password") as string
    const password = passwordRaw === "" ? undefined : passwordRaw
    const bio = formData.get("bio") as string
    const image = formData.get("image") as string
    const role = formData.get("role") as string || "EDITOR"

    // Validate fields
    const validated = UserSchema.safeParse({ name, username, password, bio, image, role })

    if (!validated.success) {
        return { error: validated.error?.issues?.[0]?.message || "Input tidak valid" }
    }

    if (!password) {
        return { error: "Password wajib diisi untuk user baru" }
    }

    // Check if username exists
    const existingUser = await prisma.user.findUnique({ where: { username } })
    if (existingUser) {
        return { error: "Username sudah digunakan" }
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    try {
        await prisma.user.create({
            data: {
                name,
                username,
                password: hashedPassword,
                bio,
                image,
                role
            }
        })
    } catch (error) {
        return { error: "Gagal membuat user" }
    }

    revalidatePath("/dashboard/users")
    redirect("/dashboard/users")
}

export async function updateUser(id: number, prevState: any, formData: FormData) {
    const session = await auth()
    if (!session || !session.user || session.user.role !== "ADMIN") return { error: "Unauthorized: Admins only" }

    const name = formData.get("name") as string
    const username = formData.get("username") as string
    const passwordRaw = formData.get("password") as string
    const password = passwordRaw === "" ? undefined : passwordRaw
    const bio = formData.get("bio") as string
    const image = formData.get("image") as string
    const role = formData.get("role") as string

    const validated = UserSchema.safeParse({ name, username, password, bio, image, role })

    if (!validated.success) {
        return { error: validated.error?.issues?.[0]?.message || "Input tidak valid" }
    }

    // Prepare update data
    const updateData: any = { name, username, bio, image, role }

    // Update password only if provided
    if (password && password.trim() !== "") {
        updateData.password = await bcrypt.hash(password, 10)
    }

    try {
        await prisma.user.update({
            where: { id },
            data: updateData
        })
    } catch (error) {
        return { error: "Gagal mengupdate user" }
    }

    revalidatePath("/dashboard/users")
    redirect("/dashboard/users")
}

export async function deleteUser(id: number) {
    const session = await auth()
    if (!session || !session.user || session.user.role !== "ADMIN") throw new Error("Unauthorized: Admins only")

    // Prevent deleting self (optional but recommended safety)
    // if (session.user.id === id.toString()) return { error: "Cannot delete yourself" }

    await prisma.user.delete({ where: { id } })
    revalidatePath("/dashboard/users")
}
