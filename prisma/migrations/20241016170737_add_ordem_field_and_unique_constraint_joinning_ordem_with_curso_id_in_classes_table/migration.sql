/*
  Warnings:

  - A unique constraint covering the columns `[curso_id,ordem]` on the table `classes` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `ordem` to the `classes` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "cadastro"."classes" ADD COLUMN     "ordem" SMALLINT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "classes_curso_id_ordem_key" ON "cadastro"."classes"("curso_id", "ordem");
