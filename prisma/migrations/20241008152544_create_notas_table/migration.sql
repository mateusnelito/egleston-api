-- CreateTable
CREATE TABLE "academico"."notas" (
    "aluno_id" INTEGER NOT NULL,
    "classe_id" INTEGER NOT NULL,
    "disciplina_id" INTEGER NOT NULL,
    "trimestre_id" INTEGER NOT NULL,
    "nota" DECIMAL(3,1) NOT NULL,

    CONSTRAINT "notas_pkey" PRIMARY KEY ("aluno_id","classe_id","disciplina_id","trimestre_id")
);

-- AddForeignKey
ALTER TABLE "academico"."notas" ADD CONSTRAINT "notas_aluno_id_fkey" FOREIGN KEY ("aluno_id") REFERENCES "cadastro"."alunos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "academico"."notas" ADD CONSTRAINT "notas_classe_id_fkey" FOREIGN KEY ("classe_id") REFERENCES "cadastro"."classes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "academico"."notas" ADD CONSTRAINT "notas_disciplina_id_fkey" FOREIGN KEY ("disciplina_id") REFERENCES "cadastro"."disciplinas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "academico"."notas" ADD CONSTRAINT "notas_trimestre_id_fkey" FOREIGN KEY ("trimestre_id") REFERENCES "academico"."trimestres"("id") ON DELETE CASCADE ON UPDATE CASCADE;
