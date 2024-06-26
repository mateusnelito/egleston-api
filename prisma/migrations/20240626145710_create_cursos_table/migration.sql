-- CreateTable
CREATE TABLE "cadastro"."cursos" (
    "id" SMALLSERIAL NOT NULL,
    "nome" VARCHAR(50) NOT NULL,
    "descricao" TEXT NOT NULL,
    "duracao" SMALLINT NOT NULL,

    CONSTRAINT "cursos_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "cursos_nome_key" ON "cadastro"."cursos"("nome");
