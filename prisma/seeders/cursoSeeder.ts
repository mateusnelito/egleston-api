import { prisma } from '../../src/lib/prisma';

export async function seedCurso() {
  await prisma.curso.createMany({
    data: [
      {
        nome: 'Engenharia de Software',
        descricao:
          'Curso voltado para o desenvolvimento de software, incluindo engenharia de requisitos, arquitetura e design de software.',
        duracao: 4,
      },
      {
        nome: 'Administração',
        descricao:
          'Curso focado em gestão empresarial, planeamento estratégico e finanças.',
        duracao: 4,
      },
      {
        nome: 'Design Gráfico',
        descricao:
          'Curso destinado à criação de projetos visuais para mídias impressas e digitais.',
        duracao: 3,
      },
      {
        nome: 'Medicina',
        descricao:
          'Curso com foco no estudo do corpo humano e formação de médicos generalistas.',
        duracao: 6,
      },
      {
        nome: 'Direito',
        descricao:
          'Curso voltado ao estudo das ciências jurídicas, preparando os alunos para diversas áreas do direito.',
        duracao: 5,
      },
    ],
  });
}
