-- CreateTable
CREATE TABLE "cadastro"."turnos" (
    "id" SMALLSERIAL NOT NULL,
    "nome" VARCHAR(30) NOT NULL,
    "inicio" TIME NOT NULL,
    "termino" TIME NOT NULL,

    CONSTRAINT "turnos_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "turnos_nome_key" ON "cadastro"."turnos"("nome");

-- CreateIndex
CREATE UNIQUE INDEX "turnos_inicio_termino_key" ON "cadastro"."turnos"("inicio", "termino");
