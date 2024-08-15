/*
  Warnings:

  - You are about to drop the `classes_turnos` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `turnoId` to the `turmas` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "cadastro"."classes_turnos" DROP CONSTRAINT "classes_turnos_classe_id_fkey";

-- DropForeignKey
ALTER TABLE "cadastro"."classes_turnos" DROP CONSTRAINT "classes_turnos_turno_id_fkey";

-- AlterTable
ALTER TABLE "cadastro"."turmas" ADD COLUMN     "turnoId" SMALLINT NOT NULL;

-- DropTable
DROP TABLE "cadastro"."classes_turnos";

-- AddForeignKey
ALTER TABLE "cadastro"."turmas" ADD CONSTRAINT "turmas_turnoId_fkey" FOREIGN KEY ("turnoId") REFERENCES "cadastro"."turnos"("id") ON DELETE CASCADE ON UPDATE CASCADE;
