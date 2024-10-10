import { prisma } from '../../src/lib/prisma';

export async function seedDisciplina() {
  try {
    await prisma.disciplina.createMany({
      data: [
        {
          nome: 'Língua Portuguesa',
          descricao: 'Estudo da gramática e literatura da língua portuguesa.',
        },
        {
          nome: 'Matemática',
          descricao:
            'Matemática básica e avançada, incluindo álgebra e geometria.',
        },
        {
          nome: 'Física',
          descricao:
            'Estudo dos princípios fundamentais da física, como movimento e energia.',
        },
        {
          nome: 'Química',
          descricao: 'Introdução às reações químicas, elementos e compostos.',
        },
        {
          nome: 'Biologia',
          descricao:
            'Estudo da vida e dos organismos vivos, incluindo ecologia e genética.',
        },
        {
          nome: 'História',
          descricao:
            'Estudo dos eventos históricos, focando em Angola e o mundo.',
        },
        {
          nome: 'Geografia',
          descricao:
            'Estudo do espaço terrestre, clima e a relação dos humanos com o meio ambiente.',
        },
        {
          nome: 'Inglês',
          descricao: 'Estudo da língua inglesa e suas regras gramaticais.',
        },
        {
          nome: 'Educação Física',
          descricao:
            'Práticas desportivas e estudo do corpo humano relacionado ao movimento.',
        },
        {
          nome: 'Filosofia',
          descricao:
            'Estudo dos principais conceitos filosóficos e seus impactos na sociedade.',
        },
        {
          nome: 'Formação de Atitudes Integradoras',
          descricao:
            'Desenvolvimento de habilidades sociais e atitudes que promovem a integração e convivência harmoniosa entre os indivíduos.',
        },
        {
          nome: 'Sociologia',
          descricao:
            'Estudo das interações sociais e comportamento humano em sociedade.',
        },
        {
          nome: 'Química Orgânica',
          descricao: 'Foco no estudo dos compostos orgânicos e suas reações.',
        },
        {
          nome: 'Literatura Portuguesa',
          descricao:
            'Análise das obras clássicas da literatura portuguesa e suas contribuições culturais.',
        },
        {
          nome: 'Matemática Aplicada',
          descricao:
            'Aplicação de conceitos matemáticos em problemas práticos e tecnológicos.',
        },
        {
          nome: 'Eletricidade',
          descricao:
            'Estudo dos princípios de eletricidade, circuitos e eletrónica básica.',
        },
        {
          nome: 'Introdução à Programação',
          descricao:
            'Fundamentos da programação com foco em linguagens de programação.',
        },
        {
          nome: 'Educação Moral e Cívica',
          descricao:
            'Estudo dos valores éticos e morais para o convívio social e a cidadania.',
        },
        {
          nome: 'Economia',
          descricao:
            'Introdução aos conceitos económicos, mercado financeiro e políticas públicas.',
        },
        {
          nome: 'Geometria Descritiva',
          descricao:
            'Estudo da representação gráfica de formas tridimensionais no espaço.',
        },
        {
          nome: 'Artes Visuais',
          descricao:
            'Estudo e prática de técnicas artísticas, como pintura e escultura.',
        },
      ],
    });
  } catch (err) {
    throw new Error(`\nError seeding Disciplina \n${err}`);
  }
}
