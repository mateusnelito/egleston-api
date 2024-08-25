export interface matriculaData {
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
  anoLectivo: string;
  pagamento: {
    valor: number;
    metodoPagamento: string;
  };
  funcionario: string;
  data: String; // FIXME: CHANGE THE TYPE TO string
}
