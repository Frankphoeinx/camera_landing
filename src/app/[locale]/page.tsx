import { notFound } from "next/navigation";

import { LocalizedLandingPage } from "@/features/landing";
import { hasLocale, locales, type Locale } from "@/i18n/config";
import { getDictionary, type Dictionary } from "@/i18n/dictionaries";

type HomePageProps = {
  params: Promise<{
    locale: string;
  }>;
};

export default async function Home({ params }: HomePageProps) {
  const { locale } = await params;

  if (!hasLocale(locale)) {
    notFound();
  }

  const dictionaries = locales.reduce(
    (accumulator, localeKey) => ({
      ...accumulator,
      [localeKey]: getDictionary(localeKey),
    }),
    {} as Record<Locale, Dictionary>,
  );

  return (
    <LocalizedLandingPage
      dictionaries={dictionaries}
      initialLocale={locale}
    />
  );
}
