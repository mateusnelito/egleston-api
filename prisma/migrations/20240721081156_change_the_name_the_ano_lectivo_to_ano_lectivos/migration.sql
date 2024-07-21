/*
  Warnings:

  - You are about to drop the `ano_lectivo` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "cadastro"."classes" DROP CONSTRAINT "classes_ano_lectivo_id_fkey";

-- DropTable
DROP TABLE "cadastro"."ano_lectivo";

-- CreateTable
CREATE TABLE "cadastro"."ano_lectivos" (
    "id" SMALLSERIAL NOT NULL,
    "nome" VARCHAR(9) NOT NULL,
    "inicio" DATE NOT NULL,
    "termino" DATE NOT NULL,

    CONSTRAINT "ano_lectivos_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ano_lectivos_nome_key" ON "cadastro"."ano_lectivos"("nome");

-- AddForeignKey
ALTER TABLE "cadastro"."classes" ADD CONSTRAINT "classes_ano_lectivo_id_fkey" FOREIGN KEY ("ano_lectivo_id") REFERENCES "cadastro"."ano_lectivos"("id") ON DELETE CASCADE ON UPDATE CASCADE;
