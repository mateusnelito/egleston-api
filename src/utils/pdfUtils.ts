import {
  ContentColumns,
  ContentTable,
  StyleReference,
  TableCell,
  TDocumentDefinitions,
} from 'pdfmake/interfaces';
import { matriculaData } from './interfaces';

export function createPdfHeader(
  institutionName: string,
  institutionAddress: string,
  institutionContact: string,
  headerStyle?: StyleReference
): ContentColumns {
  return {
    columns: [
      {
        text: '[ LOGO ] ',
        // Inserir base64 do logo aqui
        // image: 'data:image/png;base64,...',
        width: 50,
        bold: true,
      },
      [
        {
          text: institutionName,
          style: headerStyle,
          margin: [10, 0, 0, 0],
        },
        {
          text: institutionAddress,
          margin: [10, 5, 0, 5],
        },
        {
          text: institutionContact,
          margin: [10, 0, 0, 0],
        },
      ],
    ],
  };
}

export function createPdfTable(
  widths: string[],
  body: TableCell[][],
  tableStyle?: StyleReference
): ContentTable {
  return {
    style: tableStyle,
    table: {
      widths,
      body,
    },
    layout: 'noBorders',
  };
}

export function createPdfFooter(
  usuarioNome: string,
  data: String // FIXME: CHANGE THE TYPE TO string
): ContentColumns {
  return {
    columns: [
      {
        text: `Funcionário\n_____________________\n\n${usuarioNome}`,
        alignment: 'left',
      },
      { text: `\n\n\nData: ${data}`, alignment: 'right' },
    ],
  };
}

export function createMatriculaPdf(
  matricula: matriculaData
): TDocumentDefinitions {
  const tableWidths = ['40%', '*'];
  return {
    content: [
      // Dados do colégio ou instituição, nomeadamente:
      // - nome | Endereço | Contactos
      createPdfHeader(
        'Instituto Nacional de Educação',
        'Rua da Independência, Luanda, Angola',
        'Telefone: +244 222 333 444 | Email: info@ine.ao',
        { fontSize: 16, bold: true }
      ),
      {
        text: 'Comprovativo de Matrícula',
        style: 'title',
        margin: [0, 20, 0, 20],
      },
      createPdfTable(
        tableWidths,
        [
          ['Número de Matrícula:', matricula.id],
          ['Nome do Estudante:', matricula.aluno.nome],
          ['Número do BI:', matricula.aluno.numeroBi],
          ['Data de Nascimento:', matricula.aluno.dataNascimento],
          ['Gênero:', matricula.aluno.genero],
          [
            'Endereço:',
            `Rua ${matricula.aluno.endereco.rua}, Bairro ${matricula.aluno.endereco.bairro}, Casa nº ${matricula.aluno.endereco.numeroCasa}`,
          ],
        ],
        { margin: [0, 5, 0, 15] }
      ),
      { text: '', margin: [0, 10, 0, 10] }, // Margin between tables
      createPdfTable(
        tableWidths,
        [
          ['Classe:', matricula.classe],
          ['Curso:', matricula.curso],
          ['Turma:', matricula.turma],
          ['Ano Letivo:', matricula.anoLectivo],
        ],
        { margin: [0, 5, 0, 15] }
      ),
      { text: '', margin: [0, 10, 0, 10] }, // Margin between tables
      createPdfTable(
        tableWidths,
        [
          ['Valor da Matrícula:', `${matricula.pagamento.valor} Kz`],
          ['Método de Pagamento:', matricula.pagamento.metodoPagamento],
        ],
        { margin: [0, 5, 0, 15] }
      ),
      { text: '', margin: [0, 20, 0, 20] }, // Margin between tables
      createPdfFooter(matricula.funcionario, matricula.data),
    ],
    defaultStyle: { font: 'Helvetica', fontSize: 12 },
    styles: {
      title: {
        fontSize: 18,
        bold: true,
        alignment: 'center',
      },
    },
  };
}
