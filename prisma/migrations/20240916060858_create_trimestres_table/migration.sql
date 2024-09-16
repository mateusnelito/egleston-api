-- CreateTable
CREATE TABLE "academico"."trimestres" (
    "id" SMALLSERIAL NOT NULL,
    "ano_lectivo_id" INTEGER NOT NULL,
    "numero" SMALLINT NOT NULL,
    "inicio" DATE NOT NULL,
    "termino" DATE NOT NULL,

    CONSTRAINT "trimestres_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "trimestres_ano_lectivo_id_numero_key" ON "academico"."trimestres"("ano_lectivo_id", "numero");

-- AddForeignKey
ALTER TABLE "academico"."trimestres" ADD CONSTRAINT "trimestres_ano_lectivo_id_fkey" FOREIGN KEY ("ano_lectivo_id") REFERENCES "cadastro"."ano_lectivos"("id") ON DELETE CASCADE ON UPDATE CASCADE;
