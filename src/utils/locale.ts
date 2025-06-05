

export const detectLocale = (): string => {
  const saved = localStorage.getItem("locale");
  if (saved) return saved;

  // Простейшая версия синхронной детекции:
  const browserLang = navigator.language;
  if (browserLang.startsWith("ru")) return "ru";
  if (browserLang.startsWith("es")) return "es";
  if (browserLang.startsWith("zh")) return "zh";
  if (browserLang.startsWith("ar")) return "ar";
  return "en";
};