/*
  Warnings:

  - A unique constraint covering the columns `[nome,classe_id,sala_id,turnoId]` on the table `turmas` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "cadastro"."turmas_nome_classe_id_sala_id_key";

-- CreateIndex
CREATE UNIQUE INDEX "turmas_nome_classe_id_sala_id_turnoId_key" ON "cadastro"."turmas"("nome", "classe_id", "sala_id", "turnoId");
