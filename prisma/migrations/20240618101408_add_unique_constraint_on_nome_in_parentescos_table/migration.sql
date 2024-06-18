/*
  Warnings:

  - A unique constraint covering the columns `[nome]` on the table `parentesco` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "parentesco_nome_key" ON "cadastro"."parentesco"("nome");
