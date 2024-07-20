/*
  Warnings:

  - You are about to alter the column `nome` on the `classes` table. The data in that column could be lost. The data in that column will be cast from `VarChar(30)` to `VarChar(3)`.

*/
-- AlterTable
ALTER TABLE "cadastro"."classes" ALTER COLUMN "nome" SET DATA TYPE VARCHAR(3);
