import { prisma } from '../lib/prisma';
import { postAnoLectivoBodyType } from '../schemas/anoLectivoSchema';

export async function saveAnoLectivo(data: postAnoLectivoBodyType) {
  return await prisma.anoLectivo.create({
    data,
  });
}
