-- CreateTable
CREATE TABLE "cadastro"."ano_lectivo" (
    "id" SMALLSERIAL NOT NULL,
    "nome" VARCHAR(10) NOT NULL,
    "inicio" DATE NOT NULL,
    "termino" DATE NOT NULL,

    CONSTRAINT "ano_lectivo_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ano_lectivo_nome_key" ON "cadastro"."ano_lectivo"("nome");

-- CreateIndex
CREATE UNIQUE INDEX "ano_lectivo_inicio_termino_key" ON "cadastro"."ano_lectivo"("inicio", "termino");
