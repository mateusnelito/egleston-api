-- CreateTable
CREATE TABLE "cadastro"."disciplinas" (
    "id" SERIAL NOT NULL,
    "nome" VARCHAR(50) NOT NULL,
    "descricao" TEXT NOT NULL,
    "curso_id" SMALLINT NOT NULL,

    CONSTRAINT "disciplinas_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "disciplinas_nome_key" ON "cadastro"."disciplinas"("nome");

-- AddForeignKey
ALTER TABLE "cadastro"."disciplinas" ADD CONSTRAINT "disciplinas_curso_id_fkey" FOREIGN KEY ("curso_id") REFERENCES "cadastro"."cursos"("id") ON DELETE CASCADE ON UPDATE CASCADE;
