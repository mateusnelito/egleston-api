-- CreateEnum
CREATE TYPE "financeiro"."TipoPagamento" AS ENUM ('Propina', 'Matricula', 'Confirmacao');

-- CreateTable
CREATE TABLE "financeiro"."pagamentos" (
    "id" SERIAL NOT NULL,
    "aluno_id" INTEGER NOT NULL,
    "tipo_pagamento" "financeiro"."TipoPagamento" NOT NULL,
    "valor" DECIMAL(10,2) NOT NULL,
    "descricao" VARCHAR(255),
    "metodo_pagamento_id" SMALLINT NOT NULL,
    "ano_lectivo_id" SMALLINT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pagamentos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "financeiro"."metodos_pagamento" (
    "id" SMALLSERIAL NOT NULL,
    "nome" VARCHAR(50) NOT NULL,

    CONSTRAINT "metodos_pagamento_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "metodos_pagamento_nome_key" ON "financeiro"."metodos_pagamento"("nome");

-- AddForeignKey
ALTER TABLE "financeiro"."pagamentos" ADD CONSTRAINT "pagamentos_aluno_id_fkey" FOREIGN KEY ("aluno_id") REFERENCES "cadastro"."alunos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "financeiro"."pagamentos" ADD CONSTRAINT "pagamentos_metodo_pagamento_id_fkey" FOREIGN KEY ("metodo_pagamento_id") REFERENCES "financeiro"."metodos_pagamento"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "financeiro"."pagamentos" ADD CONSTRAINT "pagamentos_ano_lectivo_id_fkey" FOREIGN KEY ("ano_lectivo_id") REFERENCES "cadastro"."ano_lectivos"("id") ON DELETE CASCADE ON UPDATE CASCADE;
