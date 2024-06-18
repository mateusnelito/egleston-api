-- CreateTable
CREATE TABLE "cadastro"."responsaveis" (
    "id" SERIAL NOT NULL,
    "aluno_id" INTEGER NOT NULL,
    "nome_completo" VARCHAR(100) NOT NULL,
    "parentesco_id" SMALLINT NOT NULL,

    CONSTRAINT "responsaveis_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cadastro"."parentesco" (
    "id" SMALLSERIAL NOT NULL,
    "nome" VARCHAR(30) NOT NULL,

    CONSTRAINT "parentesco_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cadastro"."responsaveis_enderecos" (
    "id" SERIAL NOT NULL,
    "responsavel_id" INTEGER NOT NULL,
    "bairro" VARCHAR(30) NOT NULL,
    "rua" VARCHAR(50) NOT NULL,
    "numero_casa" VARCHAR(5) NOT NULL,

    CONSTRAINT "responsaveis_enderecos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cadastro"."responsaveis_contactos" (
    "id" SERIAL NOT NULL,
    "responsavel_id" INTEGER NOT NULL,
    "telefone" VARCHAR(9) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "outros" VARCHAR(255),

    CONSTRAINT "responsaveis_contactos_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "responsaveis_aluno_id_nome_completo_idx" ON "cadastro"."responsaveis"("aluno_id", "nome_completo");

-- CreateIndex
CREATE UNIQUE INDEX "responsaveis_enderecos_responsavel_id_key" ON "cadastro"."responsaveis_enderecos"("responsavel_id");

-- CreateIndex
CREATE INDEX "responsaveis_enderecos_bairro_idx" ON "cadastro"."responsaveis_enderecos"("bairro");

-- CreateIndex
CREATE UNIQUE INDEX "responsaveis_contactos_responsavel_id_key" ON "cadastro"."responsaveis_contactos"("responsavel_id");

-- CreateIndex
CREATE UNIQUE INDEX "responsaveis_contactos_telefone_key" ON "cadastro"."responsaveis_contactos"("telefone");

-- CreateIndex
CREATE UNIQUE INDEX "responsaveis_contactos_email_key" ON "cadastro"."responsaveis_contactos"("email");

-- CreateIndex
CREATE INDEX "alunos_enderecos_bairro_idx" ON "cadastro"."alunos_enderecos"("bairro");

-- AddForeignKey
ALTER TABLE "cadastro"."responsaveis" ADD CONSTRAINT "responsaveis_aluno_id_fkey" FOREIGN KEY ("aluno_id") REFERENCES "cadastro"."alunos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cadastro"."responsaveis" ADD CONSTRAINT "responsaveis_parentesco_id_fkey" FOREIGN KEY ("parentesco_id") REFERENCES "cadastro"."parentesco"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cadastro"."responsaveis_enderecos" ADD CONSTRAINT "responsaveis_enderecos_responsavel_id_fkey" FOREIGN KEY ("responsavel_id") REFERENCES "cadastro"."responsaveis"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cadastro"."responsaveis_contactos" ADD CONSTRAINT "responsaveis_contactos_responsavel_id_fkey" FOREIGN KEY ("responsavel_id") REFERENCES "cadastro"."responsaveis"("id") ON DELETE CASCADE ON UPDATE CASCADE;
