-- CreateTable
CREATE TABLE "cadastro"."professores" (
    "id" SERIAL NOT NULL,
    "nome_completo" VARCHAR(100) NOT NULL,
    "data_nascimento" DATE NOT NULL,

    CONSTRAINT "professores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cadastro"."professores_contactos" (
    "id" SERIAL NOT NULL,
    "professor_id" INTEGER NOT NULL,
    "telefone" VARCHAR(9) NOT NULL,
    "email" VARCHAR(255),
    "outros" VARCHAR(255),

    CONSTRAINT "professores_contactos_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "professores_nome_completo_idx" ON "cadastro"."professores"("nome_completo");

-- CreateIndex
CREATE UNIQUE INDEX "professores_contactos_professor_id_key" ON "cadastro"."professores_contactos"("professor_id");

-- CreateIndex
CREATE UNIQUE INDEX "professores_contactos_telefone_key" ON "cadastro"."professores_contactos"("telefone");

-- CreateIndex
CREATE UNIQUE INDEX "professores_contactos_email_key" ON "cadastro"."professores_contactos"("email");

-- AddForeignKey
ALTER TABLE "cadastro"."professores_contactos" ADD CONSTRAINT "professores_contactos_professor_id_fkey" FOREIGN KEY ("professor_id") REFERENCES "cadastro"."professores"("id") ON DELETE CASCADE ON UPDATE CASCADE;
