import { prisma } from '../../src/lib/prisma';

export async function seedCurso() {
  await prisma.curso.createMany({
    data: [
      {
        nome: 'Medicina',
        descricao:
          'Curso destinado à formação de médicos, abrangendo conhecimentos em saúde, diagnóstico e tratamento de doenças.',
        duracao: 6,
      },
      {
        nome: 'Enfermagem',
        descricao:
          'Formação de profissionais de enfermagem, com foco em cuidados de saúde e assistência ao paciente.',
        duracao: 4,
      },
      {
        nome: 'Análises Clínicas',
        descricao:
          'Curso voltado para a formação de técnicos em análises laboratoriais, focando na coleta e interpretação de exames.',
        duracao: 3,
      },
      {
        nome: 'Informática',
        descricao:
          'Curso que aborda fundamentos da computação, programação, e aplicações de software.',
        duracao: 3,
      },
      {
        nome: 'Eletrónica',
        descricao:
          'Formação em eletrónica, incluindo circuitos, sistemas digitais e manutenção de equipamentos eletrónicos.',
        duracao: 3,
      },
      {
        nome: 'Mecânica',
        descricao:
          'Curso voltado para a formação de técnicos em mecânica, com foco em manutenção e reparo de veículos e máquinas.',
        duracao: 3,
      },
      {
        nome: 'PUNIV',
        descricao:
          'Curso de Formação Universitária com foco em várias áreas do conhecimento, visando a qualificação profissional.',
        duracao: 3,
      },
      {
        nome: 'Gestão de Recursos Humanos (GRH)',
        descricao:
          'Formação em gestão de pessoas, abordando recrutamento, seleção, e desenvolvimento organizacional.',
        duracao: 3,
      },
      {
        nome: 'Gestão de Empresas',
        descricao:
          'Curso que capacita estudantes em administração, finanças e marketing para a gestão eficaz de empresas.',
        duracao: 3,
      },
      {
        nome: 'Agronomia',
        descricao:
          'Curso voltado para a formação de agrónomos, com foco em práticas agrícolas sustentáveis e desenvolvimento rural.',
        duracao: 4,
      },
    ],
  });
}
