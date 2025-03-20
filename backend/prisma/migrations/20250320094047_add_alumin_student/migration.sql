-- CreateTable
CREATE TABLE "Alumini" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "experience" TEXT,
    "company" TEXT,
    "role" TEXT,
    "rating" INTEGER NOT NULL,

    CONSTRAINT "Alumini_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Student" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "university" TEXT,
    "batch" TEXT,
    "rating" INTEGER NOT NULL,

    CONSTRAINT "Student_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Alumini" ADD CONSTRAINT "Alumini_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
