export interface matriculaPdfPrintDataInterface {
  id: number;
  aluno: {
    nome: string;
    numeroBi: string;
    dataNascimento: String; // FIXME: CHANGE THE TYPE TO string
    genero: string;
    endereco: {
      rua: string;
      bairro: string;
      numeroCasa: string;
    };
  };
  classe: string;
  curso: string;
  turma: string;
  turno: string;
  anoLectivo: string;
  pagamento: {
    valor: number;
    metodoPagamento: string;
  };
  funcionario: string;
  data: String; // FIXME: CHANGE THE TYPE TO string
}

export interface matriculaCreateDataInterface {
  classeId: number;
  cursoId?: number;
  turmaId: number;
  turnoId: number;
  metodoPagamentoId: number;
}

export interface validateAlunoNotaDataType {
  classeId: number;
  disciplinaId: number;
  trimestreId: number;
}

export interface alunoNotaUniqueKeyDataType {
  alunoId: number;
  classeId: number;
  disciplinaId: number;
  trimestreId: number;
}
