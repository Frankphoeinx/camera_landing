import { localeLabels, localeNames, locales, type Locale } from "@/i18n/config";
import styles from "./HeroScene.module.css";

type HeroLanguageSwitcherProps = {
  ariaLabel: string;
  currentLocale: Locale;
};

export function HeroLanguageSwitcher({
  ariaLabel,
  currentLocale,
}: HeroLanguageSwitcherProps) {
  return (
    <nav
      className={styles.languageSwitcher}
      aria-label={ariaLabel}
      data-language-switcher
    >
      {locales.map((locale) => (
        <a
          className={styles.languageOption}
          href={`/${locale}`}
          aria-current={locale === currentLocale ? "page" : undefined}
          aria-label={localeNames[locale]}
          data-active={locale === currentLocale}
          key={locale}
        >
          {localeLabels[locale]}
        </a>
      ))}
      <span className={styles.languageSwitcherGlyph} aria-hidden="true" />
    </nav>
  );
}
