'use server'

import prisma from "@/lib/db"
import { auth } from "@/auth"
import { dispatchWebhook } from "@/lib/webhook"

export async function triggerElearningSync() {
  const session = await auth()
  if (!session || session.user?.role !== 'ADMIN') {
    return { success: false, error: "Unauthorized: Hanya Admin yang dapat melakukan sinkronisasi." }
  }

  try {
    const students = await prisma.student.findMany({
      where: { status: 'AKTIF' },
      select: { id: true, nis: true, nisn: true, name: true, class: true, status: true }
    })
    const teachers = await prisma.teacher.findMany({
      select: { id: true, nip: true, name: true, subject: true, position: true }
    })
    const academicYears = await prisma.academicYear.findMany({
      select: { id: true, name: true, isActive: true, startDate: true, endDate: true }
    })

    const result = await dispatchWebhook('bulk_sync', {
      students,
      teachers,
      academicYears
    })

    if (!result.success) {
      return { success: false, error: result.error || "Gagal mengirim data webhook ke E-Learning. Pastikan server E-Learning aktif." }
    }

    return {
      success: true,
      message: `Sinkronisasi berhasil! ${students.length} Siswa, ${teachers.length} Guru, dan ${academicYears.length} Tahun Ajaran telah disinkronkan ke E-Learning.`
    }
  } catch (error: any) {
    console.error("Error triggering Elearning sync:", error)
    return { success: false, error: error.message || "Terjadi kesalahan saat sinkronisasi." }
  }
}
