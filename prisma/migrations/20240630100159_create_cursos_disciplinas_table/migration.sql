-- CreateTable
CREATE TABLE "cadastro"."cursos_disciplinas" (
    "curso_id" SMALLINT NOT NULL,
    "disciplina_id" INTEGER NOT NULL,

    CONSTRAINT "cursos_disciplinas_pkey" PRIMARY KEY ("curso_id","disciplina_id")
);

-- AddForeignKey
ALTER TABLE "cadastro"."cursos_disciplinas" ADD CONSTRAINT "cursos_disciplinas_curso_id_fkey" FOREIGN KEY ("curso_id") REFERENCES "cadastro"."cursos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cadastro"."cursos_disciplinas" ADD CONSTRAINT "cursos_disciplinas_disciplina_id_fkey" FOREIGN KEY ("disciplina_id") REFERENCES "cadastro"."disciplinas"("id") ON DELETE CASCADE ON UPDATE CASCADE;
