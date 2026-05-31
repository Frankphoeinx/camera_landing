import type { MouseEvent } from "react";
import { localeLabels, localeNames, locales, type Locale } from "@/i18n/config";
import styles from "./HeroScene.module.css";

type HeroLanguageSwitcherProps = {
  ariaLabel: string;
  currentLocale: Locale;
  onLocaleChange?: (locale: Locale) => void;
};

export function HeroLanguageSwitcher({
  ariaLabel,
  currentLocale,
  onLocaleChange,
}: HeroLanguageSwitcherProps) {
  const handleLocaleClick = (
    event: MouseEvent<HTMLAnchorElement>,
    locale: Locale,
  ) => {
    if (
      !onLocaleChange ||
      locale === currentLocale ||
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.altKey ||
      event.ctrlKey ||
      event.shiftKey
    ) {
      return;
    }

    event.preventDefault();
    onLocaleChange(locale);
  };

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
          onClick={(event) => handleLocaleClick(event, locale)}
        >
          {localeLabels[locale]}
        </a>
      ))}
      <span className={styles.languageSwitcherGlyph} aria-hidden="true" />
    </nav>
  );
}
