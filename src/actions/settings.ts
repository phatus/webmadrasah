'use server'

import prisma from "@/lib/db"
import { revalidatePath } from "next/cache"
import { auth } from "@/auth"

// Define default settings keys
export type SettingKey =
    | 'site_name'
    | 'site_description'
    | 'site_logo'
    | 'contact_email'
    | 'contact_phone'
    | 'contact_address'
    | 'social_facebook'
    | 'social_instagram'
    | 'social_youtube'
    | 'headmaster_name'
    | 'map_embed'

export async function getSettings() {
    try {
        const settings = await prisma.appSetting.findMany()
        // Convert array to object for easier access
        const settingsMap: Record<string, string> = {}
        settings.forEach((s: any) => {
            settingsMap[s.key] = s.value
        })
        return settingsMap
    } catch (error) {
        return {}
    }
}

export async function getSetting(key: SettingKey) {
    try {
        const setting = await prisma.appSetting.findUnique({
            where: { key }
        })
        return setting?.value || null
    } catch (error) {
        return null
    }
}

export async function updateSettings(prevState: any, formData: FormData) {
    const session = await auth()
    if (!session) return { error: "Unauthorized" }

    const settingsToUpdate: Record<string, string> = {}

    // Extract all possible keys from formData
    const keys: SettingKey[] = [
        'site_name', 'site_description', 'site_logo',
        'contact_email', 'contact_phone', 'contact_address',
        'social_facebook', 'social_instagram', 'social_youtube',
        'headmaster_name', 'map_embed'
    ]

    for (const key of keys) {
        const value = formData.get(key)?.toString()
        if (value !== undefined) {
            settingsToUpdate[key] = value
        }
    }

    try {
        // Prisma doesn't support bulk upsert easily in SQLite without raw query or loop
        // Loop is fine for small number of settings
        for (const [key, value] of Object.entries(settingsToUpdate)) {
            await prisma.appSetting.upsert({
                where: { key },
                update: { value },
                create: { key, value }
            })
        }
    } catch (error) {
        console.error("Failed to update settings", error)
        return { error: "Gagal menyimpan pengaturan" }
    }

    revalidatePath("/") // Revalidate everything as settings affect global layout
    return { success: true, message: "Pengaturan berhasil disimpan" }
}
