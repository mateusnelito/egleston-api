/*
  Warnings:

  - You are about to alter the column `nome` on the `ano_lectivo` table. The data in that column could be lost. The data in that column will be cast from `VarChar(10)` to `VarChar(9)`.

*/
-- DropIndex
DROP INDEX "cadastro"."ano_lectivo_inicio_termino_key";

-- AlterTable
ALTER TABLE "cadastro"."ano_lectivo" ALTER COLUMN "nome" SET DATA TYPE VARCHAR(9);
