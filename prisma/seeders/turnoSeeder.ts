import { prisma } from '../../src/lib/prisma';

export async function seedTurno() {
  await prisma.turno.createMany({
    data: [
      { nome: 'Manhã', inicio: '07:00', termino: '12:00' },
      { nome: 'Tarde', inicio: '13:00', termino: '18:05' },
      { nome: 'Noite', inicio: '18:30', termino: '22:00' },
    ],
  });
}
