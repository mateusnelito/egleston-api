export const fullNameRegEx = /^[A-Za-zÀ-ÖØ-öø-ÿ\s'-]+$/;
export const outrosContactosRegEx = /^[a-zA-ZÀ-ÿ0-9.,;:'"\-\(\)\s]{5,255}$/;
export const numeroBiRegEx = /^\d{9}[A-Z]{2}\d{3}$/;
export const cursoNomeRegEx =
  /^[A-Za-zÀ-ÖØ-öø-ÿ][A-Za-zÀ-ÖØ-öø-ÿ0-9 '’\-]{2,49}$/;
export const descricaoRegEx = /^[A-Za-zÀ-ÖØ-öø-ÿ0-9\s.,;'"-]{10,500}$/;
export const classeNomeRegEx = /^\d{1,2}ª - \d{4}-\d{4}$/;
