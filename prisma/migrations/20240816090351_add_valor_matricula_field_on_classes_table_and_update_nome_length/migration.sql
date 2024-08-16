/*
  Warnings:

  - Added the required column `valor_matricula` to the `classes` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "cadastro"."classes" ADD COLUMN     "valor_matricula" DECIMAL(10,2) NOT NULL,
ALTER COLUMN "nome" SET DATA TYPE VARCHAR(15);
