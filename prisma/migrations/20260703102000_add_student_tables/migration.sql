-- CreateTable
CREATE TABLE "Student" (
    "id" SERIAL NOT NULL,
    "nis" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "class" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Student_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StudentViolation" (
    "id" SERIAL NOT NULL,
    "studentId" INTEGER NOT NULL,
    "violationDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "description" TEXT NOT NULL,
    "penalty" TEXT,
    "points" INTEGER NOT NULL DEFAULT 0,
    "reporterName" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StudentViolation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Student_nis_key" ON "Student"("nis");

-- CreateIndex
CREATE INDEX "StudentViolation_studentId_idx" ON "StudentViolation"("studentId");

-- AddForeignKey
ALTER TABLE "StudentViolation" ADD CONSTRAINT "StudentViolation_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;
