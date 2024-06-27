export const FULL_NAME_REGEX = /^[A-Za-zÀ-ÖØ-öø-ÿ\s'-]+$/;
export const OUTROS_CONTACTOS_REGEX = /^[a-zA-ZÀ-ÿ0-9.,;:'"\-\(\)\s]{5,255}$/;
export const NUMERO_BI_REGEX = /^\d{9}[A-Z]{2}\d{3}$/;
export const CURSO_NOME_REGEX =
  /^[A-Za-zÀ-ÖØ-öø-ÿ][A-Za-zÀ-ÖØ-öø-ÿ0-9 '’\-]{2,49}$/;
export const DESCRICAO_REGEX = /^[A-Za-zÀ-ÖØ-öø-ÿ0-9\s.,;'"-]{10,500}$/;
