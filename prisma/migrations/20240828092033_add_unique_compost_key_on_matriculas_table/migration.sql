/*
  Warnings:

  - A unique constraint covering the columns `[aluno_id,classe_id,ano_lectivo_id]` on the table `matriculas` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "matriculas_aluno_id_classe_id_ano_lectivo_id_key" ON "academico"."matriculas"("aluno_id", "classe_id", "ano_lectivo_id");
