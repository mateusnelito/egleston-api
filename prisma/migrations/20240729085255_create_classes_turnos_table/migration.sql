-- CreateTable
CREATE TABLE "cadastro"."classes_turnos" (
    "classe_id" INTEGER NOT NULL,
    "turno_id" SMALLINT NOT NULL,

    CONSTRAINT "classes_turnos_pkey" PRIMARY KEY ("classe_id","turno_id")
);

-- AddForeignKey
ALTER TABLE "cadastro"."classes_turnos" ADD CONSTRAINT "classes_turnos_classe_id_fkey" FOREIGN KEY ("classe_id") REFERENCES "cadastro"."classes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cadastro"."classes_turnos" ADD CONSTRAINT "classes_turnos_turno_id_fkey" FOREIGN KEY ("turno_id") REFERENCES "cadastro"."turnos"("id") ON DELETE CASCADE ON UPDATE CASCADE;
