/*
  Warnings:

  - You are about to drop the column `turno_id` on the `matriculas` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "academico"."matriculas" DROP CONSTRAINT "matriculas_turno_id_fkey";

-- AlterTable
ALTER TABLE "academico"."matriculas" DROP COLUMN "turno_id";
