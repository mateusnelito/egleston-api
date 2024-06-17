-- CreateTable
CREATE TABLE "cadastro"."alunos_enderecos" (
    "id" SERIAL NOT NULL,
    "aluno_id" INTEGER NOT NULL,
    "bairro" VARCHAR(30) NOT NULL,
    "rua" VARCHAR(50) NOT NULL,
    "numero_casa" VARCHAR(5) NOT NULL,

    CONSTRAINT "alunos_enderecos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cadastro"."alunos_contactos" (
    "id" SERIAL NOT NULL,
    "aluno_id" INTEGER NOT NULL,
    "telefone" VARCHAR(9) NOT NULL,
    "email" VARCHAR(255) NOT NULL,

    CONSTRAINT "alunos_contactos_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "alunos_enderecos_aluno_id_key" ON "cadastro"."alunos_enderecos"("aluno_id");

-- CreateIndex
CREATE UNIQUE INDEX "alunos_contactos_aluno_id_key" ON "cadastro"."alunos_contactos"("aluno_id");

-- CreateIndex
CREATE UNIQUE INDEX "alunos_contactos_telefone_key" ON "cadastro"."alunos_contactos"("telefone");

-- CreateIndex
CREATE UNIQUE INDEX "alunos_contactos_email_key" ON "cadastro"."alunos_contactos"("email");

-- AddForeignKey
ALTER TABLE "cadastro"."alunos_enderecos" ADD CONSTRAINT "alunos_enderecos_aluno_id_fkey" FOREIGN KEY ("aluno_id") REFERENCES "cadastro"."alunos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cadastro"."alunos_contactos" ADD CONSTRAINT "alunos_contactos_aluno_id_fkey" FOREIGN KEY ("aluno_id") REFERENCES "cadastro"."alunos"("id") ON DELETE CASCADE ON UPDATE CASCADE;
