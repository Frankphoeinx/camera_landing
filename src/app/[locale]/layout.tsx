import type { Metadata, Viewport } from "next";
import { IBM_Plex_Mono, Manrope } from "next/font/google";

import { defaultLocale, hasLocale, locales } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import "../globals.css";

const manrope = Manrope({
  display: "swap",
  subsets: ["latin", "cyrillic"],
  variable: "--font-manrope",
});

const ibmPlexMono = IBM_Plex_Mono({
  display: "swap",
  subsets: ["latin", "cyrillic"],
  variable: "--font-ibm-plex-mono",
  weight: ["400", "500", "600", "700"],
});

type LocaleLayoutProps = Readonly<{
  children: React.ReactNode;
  params: Promise<{
    locale: string;
  }>;
}>;

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: Pick<LocaleLayoutProps, "params">): Promise<Metadata> {
  const { locale } = await params;
  const resolvedLocale = hasLocale(locale) ? locale : defaultLocale;
  const dictionary = getDictionary(resolvedLocale);

  return dictionary.metadata;
}

export const viewport: Viewport = {
  colorScheme: "dark",
  themeColor: "#050505",
};

export default async function RootLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await params;
  const resolvedLocale = hasLocale(locale) ? locale : defaultLocale;

  return (
    <html
      lang={resolvedLocale}
      className={`${manrope.variable} ${ibmPlexMono.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
