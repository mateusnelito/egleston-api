import { prisma } from '../../src/lib/prisma';

// Generates a random number between min and max
function generateRandomNumber(min: number, max: number) {
  return Math.round(Math.random() * (max - min) + min);
}

export async function seedSala() {
  await prisma.sala.createMany({
    data: Array.from({ length: 20 }).map((_, i) => ({
      nome: `Sala - ${++i}`,
      capacidade: generateRandomNumber(10, 70),
      localizacao:
        'O Lorem Ipsum é um texto modelo da indústria tipográfica e de impressão. O Lorem Ipsum tem vindo a ser o texto padrão usado por estas indústrias desde o ano de 1500, quando uma misturou os caracteres de um texto para criar um espécime de livro. ',
    })),
  });
}
