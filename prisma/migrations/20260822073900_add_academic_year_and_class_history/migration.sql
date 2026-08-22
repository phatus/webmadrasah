-- AlterTable: Add status field to Student
ALTER TABLE "Student" ADD COLUMN IF NOT EXISTS "status" TEXT NOT NULL DEFAULT 'AKTIF';

-- CreateTable: AcademicYear
CREATE TABLE IF NOT EXISTS "AcademicYear" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "AcademicYear_pkey" PRIMARY KEY ("id")
);

-- CreateTable: StudentClassHistory
CREATE TABLE IF NOT EXISTS "StudentClassHistory" (
    "id" SERIAL NOT NULL,
    "studentId" INTEGER NOT NULL,
    "academicYearId" INTEGER NOT NULL,
    "class" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'AKTIF',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "StudentClassHistory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "AcademicYear_name_key" ON "AcademicYear"("name");
CREATE UNIQUE INDEX IF NOT EXISTS "StudentClassHistory_studentId_academicYearId_key" ON "StudentClassHistory"("studentId", "academicYearId");
CREATE INDEX IF NOT EXISTS "StudentClassHistory_studentId_idx" ON "StudentClassHistory"("studentId");
CREATE INDEX IF NOT EXISTS "StudentClassHistory_academicYearId_idx" ON "StudentClassHistory"("academicYearId");

-- AddForeignKey
ALTER TABLE "StudentClassHistory" ADD CONSTRAINT "StudentClassHistory_studentId_fkey" 
    FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "StudentClassHistory" ADD CONSTRAINT "StudentClassHistory_academicYearId_fkey" 
    FOREIGN KEY ("academicYearId") REFERENCES "AcademicYear"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
