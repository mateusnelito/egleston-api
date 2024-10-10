import { prisma } from '../../src/lib/prisma';
import { transformToDate } from './seed';

export async function anoLectivoSeeder() {
  // Create default AnoLectivo
  await prisma.anoLectivo.createMany({
    data: [
      {
        nome: '2023-2024',
        inicio: transformToDate('2023-09-01'),
        termino: transformToDate('2024-08-01'),
        activo: false,
        matriculaAberta: false,
      },
      {
        nome: '2024-2025',
        inicio: transformToDate('2024-09-01'),
        termino: transformToDate('2025-08-01'),
        activo: true,
        matriculaAberta: true,
      },
    ],
  });

  // Create default trimestres
  await prisma.trimestre.createMany({
    data: [
      {
        anoLectivoId: 1,
        numero: 1,
        inicio: transformToDate('2023-09-04'),
        termino: transformToDate('2023-12-15'),
      },
      {
        anoLectivoId: 1,
        numero: 2,
        inicio: transformToDate('2024-01-03'),
        termino: transformToDate('2024-03-28'),
      },
      {
        anoLectivoId: 1,
        numero: 3,
        inicio: transformToDate('2024-04-08'),
        termino: transformToDate('2024-07-31'),
      },
      {
        anoLectivoId: 2,
        numero: 1,
        inicio: transformToDate('2024-09-02'),
        termino: transformToDate('2025-01-03'),
      },
      {
        anoLectivoId: 2,
        numero: 2,
        inicio: transformToDate('2025-01-06'),
        termino: transformToDate('2025-04-17'),
      },
      {
        anoLectivoId: 2,
        numero: 3,
        inicio: transformToDate('2025-04-21'),
        termino: transformToDate('2025-07-31'),
      },
    ],
  });
}
