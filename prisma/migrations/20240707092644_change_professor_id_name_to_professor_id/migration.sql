/*
  Warnings:

  - The primary key for the `disciplinas_professores` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `professorId` on the `disciplinas_professores` table. All the data in the column will be lost.
  - Added the required column `professor_id` to the `disciplinas_professores` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "cadastro"."disciplinas_professores" DROP CONSTRAINT "disciplinas_professores_professorId_fkey";

-- AlterTable
ALTER TABLE "cadastro"."disciplinas_professores" DROP CONSTRAINT "disciplinas_professores_pkey",
DROP COLUMN "professorId",
ADD COLUMN     "professor_id" INTEGER NOT NULL,
ADD CONSTRAINT "disciplinas_professores_pkey" PRIMARY KEY ("disciplina_id", "professor_id");

-- AddForeignKey
ALTER TABLE "cadastro"."disciplinas_professores" ADD CONSTRAINT "disciplinas_professores_professor_id_fkey" FOREIGN KEY ("professor_id") REFERENCES "cadastro"."professores"("id") ON DELETE CASCADE ON UPDATE CASCADE;
