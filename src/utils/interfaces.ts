export interface validateNotaDataType {
  alunoId?: number;
  classeId: number;
  disciplinaId: number;
  trimestreId: number;
}

export interface notaIdDataType {
  alunoId: number;
  classeId: number;
  disciplinaId: number;
  trimestreId: number;
}

export interface ErrorsFormat {
  [fieldKey: string]:
    | string[]
    | { [i: string]: string[] }
    | { [i: string]: unknown };
}
