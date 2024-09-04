/*
  Warnings:

  - Added the required column `turno_id` to the `matriculas` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "academico"."matriculas" ADD COLUMN     "turno_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "academico"."matriculas" ADD CONSTRAINT "matriculas_turno_id_fkey" FOREIGN KEY ("turno_id") REFERENCES "cadastro"."turnos"("id") ON DELETE CASCADE ON UPDATE CASCADE;
