/*
  Warnings:

  - You are about to drop the `professores_disciplinas_classes` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `cursos_disciplinas` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `disciplinas_professores` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "academico"."professores_disciplinas_classes" DROP CONSTRAINT "professores_disciplinas_classes_classe_id_fkey";

-- DropForeignKey
ALTER TABLE "academico"."professores_disciplinas_classes" DROP CONSTRAINT "professores_disciplinas_classes_disciplina_id_fkey";

-- DropForeignKey
ALTER TABLE "academico"."professores_disciplinas_classes" DROP CONSTRAINT "professores_disciplinas_classes_professor_id_fkey";

-- DropForeignKey
ALTER TABLE "academico"."professores_disciplinas_classes" DROP CONSTRAINT "professores_disciplinas_classes_turma_id_fkey";

-- DropForeignKey
ALTER TABLE "cadastro"."cursos_disciplinas" DROP CONSTRAINT "cursos_disciplinas_curso_id_fkey";

-- DropForeignKey
ALTER TABLE "cadastro"."cursos_disciplinas" DROP CONSTRAINT "cursos_disciplinas_disciplina_id_fkey";

-- DropForeignKey
ALTER TABLE "cadastro"."disciplinas_professores" DROP CONSTRAINT "disciplinas_professores_disciplina_id_fkey";

-- DropForeignKey
ALTER TABLE "cadastro"."disciplinas_professores" DROP CONSTRAINT "disciplinas_professores_professor_id_fkey";

-- DropTable
DROP TABLE "academico"."professores_disciplinas_classes";

-- DropTable
DROP TABLE "cadastro"."cursos_disciplinas";

-- DropTable
DROP TABLE "cadastro"."disciplinas_professores";

-- CreateTable
CREATE TABLE "cadastro"."professor_disciplinas" (
    "disciplina_id" INTEGER NOT NULL,
    "professor_id" INTEGER NOT NULL,

    CONSTRAINT "professor_disciplinas_pkey" PRIMARY KEY ("disciplina_id","professor_id")
);

-- CreateTable
CREATE TABLE "academico"."professor_disciplina_classes" (
    "professor_id" INTEGER NOT NULL,
    "disciplina_id" INTEGER NOT NULL,
    "classe_id" INTEGER NOT NULL,
    "turma_id" INTEGER NOT NULL,

    CONSTRAINT "professor_disciplina_classes_pkey" PRIMARY KEY ("professor_id","disciplina_id","classe_id","turma_id")
);

-- CreateTable
CREATE TABLE "cadastro"."classe_disciplinas" (
    "classeId" INTEGER NOT NULL,
    "disciplinaId" SMALLINT NOT NULL,

    CONSTRAINT "classe_disciplinas_pkey" PRIMARY KEY ("classeId","disciplinaId")
);

-- AddForeignKey
ALTER TABLE "cadastro"."professor_disciplinas" ADD CONSTRAINT "professor_disciplinas_disciplina_id_fkey" FOREIGN KEY ("disciplina_id") REFERENCES "cadastro"."disciplinas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cadastro"."professor_disciplinas" ADD CONSTRAINT "professor_disciplinas_professor_id_fkey" FOREIGN KEY ("professor_id") REFERENCES "cadastro"."professores"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "academico"."professor_disciplina_classes" ADD CONSTRAINT "professor_disciplina_classes_professor_id_fkey" FOREIGN KEY ("professor_id") REFERENCES "cadastro"."professores"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "academico"."professor_disciplina_classes" ADD CONSTRAINT "professor_disciplina_classes_disciplina_id_fkey" FOREIGN KEY ("disciplina_id") REFERENCES "cadastro"."disciplinas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "academico"."professor_disciplina_classes" ADD CONSTRAINT "professor_disciplina_classes_classe_id_fkey" FOREIGN KEY ("classe_id") REFERENCES "cadastro"."classes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "academico"."professor_disciplina_classes" ADD CONSTRAINT "professor_disciplina_classes_turma_id_fkey" FOREIGN KEY ("turma_id") REFERENCES "cadastro"."turmas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cadastro"."classe_disciplinas" ADD CONSTRAINT "classe_disciplinas_classeId_fkey" FOREIGN KEY ("classeId") REFERENCES "cadastro"."classes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cadastro"."classe_disciplinas" ADD CONSTRAINT "classe_disciplinas_disciplinaId_fkey" FOREIGN KEY ("disciplinaId") REFERENCES "cadastro"."disciplinas"("id") ON DELETE CASCADE ON UPDATE CASCADE;
