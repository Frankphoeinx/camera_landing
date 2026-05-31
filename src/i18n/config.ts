export const locales = ["en", "ru", "uz"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

export const localeLabels: Record<Locale, string> = {
  en: "EN",
  ru: "RU",
  uz: "UZ",
};

export const localeNames: Record<Locale, string> = {
  en: "English",
  ru: "Русский",
  uz: "O'zbekcha",
};

export function hasLocale(locale: string): locale is Locale {
  return locales.includes(locale as Locale);
}

export function getLocaleFromAcceptLanguage(header: string | null): Locale {
  if (!header) {
    return defaultLocale;
  }

  const preferredLanguages = header
    .split(",")
    .map((entry) => {
      const [languageRange, qualityValue] = entry.trim().split(";q=");
      const language = languageRange?.toLowerCase().split("-")[0] ?? "";
      const quality = qualityValue ? Number.parseFloat(qualityValue) : 1;

      return {
        language,
        quality: Number.isFinite(quality) ? quality : 0,
      };
    })
    .sort((a, b) => b.quality - a.quality);

  for (const { language } of preferredLanguages) {
    if (hasLocale(language)) {
      return language;
    }
  }

  return defaultLocale;
}
