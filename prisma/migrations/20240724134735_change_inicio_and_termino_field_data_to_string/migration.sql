/*
  Warnings:

  - Changed the type of `inicio` on the `turnos` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `termino` on the `turnos` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "cadastro"."turnos" DROP COLUMN "inicio",
ADD COLUMN     "inicio" VARCHAR(8) NOT NULL,
DROP COLUMN "termino",
ADD COLUMN     "termino" VARCHAR(8) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "turnos_inicio_termino_key" ON "cadastro"."turnos"("inicio", "termino");
