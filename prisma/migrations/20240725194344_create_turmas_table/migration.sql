-- CreateTable
CREATE TABLE "cadastro"."turmas" (
    "id" SERIAL NOT NULL,
    "nome" VARCHAR(30) NOT NULL,
    "classe_id" INTEGER NOT NULL,
    "sala_id" SMALLINT NOT NULL,

    CONSTRAINT "turmas_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "turmas_nome_classe_id_sala_id_key" ON "cadastro"."turmas"("nome", "classe_id", "sala_id");

-- AddForeignKey
ALTER TABLE "cadastro"."turmas" ADD CONSTRAINT "turmas_classe_id_fkey" FOREIGN KEY ("classe_id") REFERENCES "cadastro"."classes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cadastro"."turmas" ADD CONSTRAINT "turmas_sala_id_fkey" FOREIGN KEY ("sala_id") REFERENCES "cadastro"."salas"("id") ON DELETE CASCADE ON UPDATE CASCADE;
