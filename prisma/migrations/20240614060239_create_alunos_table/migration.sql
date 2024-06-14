-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "academico";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "cadastro";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "financeiro";

-- CreateEnum
CREATE TYPE "cadastro"."Genero" AS ENUM ('M', 'F');

-- CreateTable
CREATE TABLE "cadastro"."alunos" (
    "id" SERIAL NOT NULL,
    "nome_completo" VARCHAR(100) NOT NULL,
    "nome_completo_pai" VARCHAR(100) NOT NULL,
    "nome_completo_mae" VARCHAR(100) NOT NULL,
    "numero_bi" VARCHAR(14) NOT NULL,
    "data_nascimento" DATE NOT NULL,
    "genero" "cadastro"."Genero" NOT NULL,

    CONSTRAINT "alunos_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "alunos_numero_bi_key" ON "cadastro"."alunos"("numero_bi");
