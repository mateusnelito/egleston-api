-- CreateTable
CREATE TABLE "cadastro"."salas" (
    "id" SMALLSERIAL NOT NULL,
    "nome" VARCHAR(30) NOT NULL,
    "capacidade" SMALLINT NOT NULL,
    "localizacao" VARCHAR(255) NOT NULL,

    CONSTRAINT "salas_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "salas_nome_key" ON "cadastro"."salas"("nome");
