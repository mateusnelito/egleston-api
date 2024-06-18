/*
  Warnings:

  - You are about to drop the `parentesco` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "cadastro"."responsaveis" DROP CONSTRAINT "responsaveis_parentesco_id_fkey";

-- DropTable
DROP TABLE "cadastro"."parentesco";

-- CreateTable
CREATE TABLE "cadastro"."parentescos" (
    "id" SMALLSERIAL NOT NULL,
    "nome" VARCHAR(30) NOT NULL,

    CONSTRAINT "parentescos_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "parentescos_nome_key" ON "cadastro"."parentescos"("nome");

-- AddForeignKey
ALTER TABLE "cadastro"."responsaveis" ADD CONSTRAINT "responsaveis_parentesco_id_fkey" FOREIGN KEY ("parentesco_id") REFERENCES "cadastro"."parentescos"("id") ON DELETE CASCADE ON UPDATE CASCADE;
