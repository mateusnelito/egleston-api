-- CreateTable
CREATE TABLE "academico"."matriculas" (
    "id" SERIAL NOT NULL,
    "aluno_id" INTEGER NOT NULL,
    "classe_id" INTEGER NOT NULL,
    "curso_id" INTEGER NOT NULL,
    "turma_id" INTEGER NOT NULL,
    "ano_lectivo_id" SMALLINT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "matriculas_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "academico"."matriculas" ADD CONSTRAINT "matriculas_aluno_id_fkey" FOREIGN KEY ("aluno_id") REFERENCES "cadastro"."alunos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "academico"."matriculas" ADD CONSTRAINT "matriculas_classe_id_fkey" FOREIGN KEY ("classe_id") REFERENCES "cadastro"."classes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "academico"."matriculas" ADD CONSTRAINT "matriculas_curso_id_fkey" FOREIGN KEY ("curso_id") REFERENCES "cadastro"."cursos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "academico"."matriculas" ADD CONSTRAINT "matriculas_turma_id_fkey" FOREIGN KEY ("turma_id") REFERENCES "cadastro"."turmas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "academico"."matriculas" ADD CONSTRAINT "matriculas_ano_lectivo_id_fkey" FOREIGN KEY ("ano_lectivo_id") REFERENCES "cadastro"."ano_lectivos"("id") ON DELETE CASCADE ON UPDATE CASCADE;
