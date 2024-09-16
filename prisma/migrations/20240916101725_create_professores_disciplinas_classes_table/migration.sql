-- CreateTable
CREATE TABLE "academico"."professores_disciplinas_classes" (
    "professor_id" INTEGER NOT NULL,
    "disciplina_id" INTEGER NOT NULL,
    "classe_id" INTEGER NOT NULL,
    "turma_id" INTEGER NOT NULL,

    CONSTRAINT "professores_disciplinas_classes_pkey" PRIMARY KEY ("professor_id","disciplina_id","classe_id","turma_id")
);

-- AddForeignKey
ALTER TABLE "academico"."professores_disciplinas_classes" ADD CONSTRAINT "professores_disciplinas_classes_professor_id_fkey" FOREIGN KEY ("professor_id") REFERENCES "cadastro"."professores"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "academico"."professores_disciplinas_classes" ADD CONSTRAINT "professores_disciplinas_classes_disciplina_id_fkey" FOREIGN KEY ("disciplina_id") REFERENCES "cadastro"."disciplinas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "academico"."professores_disciplinas_classes" ADD CONSTRAINT "professores_disciplinas_classes_classe_id_fkey" FOREIGN KEY ("classe_id") REFERENCES "cadastro"."classes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "academico"."professores_disciplinas_classes" ADD CONSTRAINT "professores_disciplinas_classes_turma_id_fkey" FOREIGN KEY ("turma_id") REFERENCES "cadastro"."turmas"("id") ON DELETE CASCADE ON UPDATE CASCADE;
