-- CreateTable
CREATE TABLE "cadastro"."disciplinas_professores" (
    "disciplina_id" INTEGER NOT NULL,
    "professorId" INTEGER NOT NULL,

    CONSTRAINT "disciplinas_professores_pkey" PRIMARY KEY ("disciplina_id","professorId")
);

-- AddForeignKey
ALTER TABLE "cadastro"."disciplinas_professores" ADD CONSTRAINT "disciplinas_professores_disciplina_id_fkey" FOREIGN KEY ("disciplina_id") REFERENCES "cadastro"."disciplinas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cadastro"."disciplinas_professores" ADD CONSTRAINT "disciplinas_professores_professorId_fkey" FOREIGN KEY ("professorId") REFERENCES "cadastro"."professores"("id") ON DELETE CASCADE ON UPDATE CASCADE;
