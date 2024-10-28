/*
  Warnings:

  - You are about to drop the column `curso_id` on the `matriculas` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "academico"."matriculas" DROP CONSTRAINT "matriculas_curso_id_fkey";

-- AlterTable
ALTER TABLE "academico"."matriculas" DROP COLUMN "curso_id";
