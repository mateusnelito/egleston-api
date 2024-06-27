/*
  Warnings:

  - You are about to drop the column `curso_id` on the `disciplinas` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "cadastro"."disciplinas" DROP CONSTRAINT "disciplinas_curso_id_fkey";

-- AlterTable
ALTER TABLE "cadastro"."disciplinas" DROP COLUMN "curso_id";
