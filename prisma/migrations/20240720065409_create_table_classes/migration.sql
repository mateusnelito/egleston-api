-- CreateTable
CREATE TABLE "cadastro"."classes" (
    "id" SERIAL NOT NULL,
    "nome" VARCHAR(30) NOT NULL,
    "ano_lectivo_id" SMALLINT NOT NULL,
    "curso_id" SMALLINT NOT NULL,

    CONSTRAINT "classes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "classes_nome_ano_lectivo_id_curso_id_key" ON "cadastro"."classes"("nome", "ano_lectivo_id", "curso_id");

-- AddForeignKey
ALTER TABLE "cadastro"."classes" ADD CONSTRAINT "classes_ano_lectivo_id_fkey" FOREIGN KEY ("ano_lectivo_id") REFERENCES "cadastro"."ano_lectivo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cadastro"."classes" ADD CONSTRAINT "classes_curso_id_fkey" FOREIGN KEY ("curso_id") REFERENCES "cadastro"."cursos"("id") ON DELETE CASCADE ON UPDATE CASCADE;
