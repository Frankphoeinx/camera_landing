import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { hasLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import styles from "./ThankYouPage.module.css";

type ThankYouPageProps = {
  params: Promise<{
    locale: string;
  }>;
  searchParams: Promise<{
    request?: string;
  }>;
};

export async function generateMetadata({
  params,
}: Pick<ThankYouPageProps, "params">): Promise<Metadata> {
  const { locale } = await params;

  if (!hasLocale(locale)) {
    return {};
  }

  return {
    ...getDictionary(locale).thankYou.metadata,
    robots: {
      follow: false,
      index: false,
    },
  };
}

export default async function ThankYouPage({
  params,
  searchParams,
}: ThankYouPageProps) {
  const { locale } = await params;

  if (!hasLocale(locale)) {
    notFound();
  }

  const { request } = await searchParams;
  const dictionary = getDictionary(locale);
  const content = dictionary.thankYou;
  const requestId = request || content.requestFallback;

  return (
    <main aria-label={content.ariaLabel}>
      <section className={styles.section}>
        <div className={styles.panel}>
          <div className={styles.content}>
            <p className={styles.eyebrow}>{content.eyebrow}</p>
            <h1>{content.title}</h1>
            <p>{content.copy}</p>
            <div className={styles.request}>
              <span>{content.requestLabel}</span>
              <strong>{requestId}</strong>
            </div>
          </div>

          <aside className={styles.sidebar}>
            <h2>{content.nextTitle}</h2>
            <ol className={styles.steps}>
              {content.nextSteps.map((step, index) => (
                <li key={index}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  {step}
                </li>
              ))}
            </ol>
            <div className={styles.actions}>
              <a href={`/${locale}`}>{content.primaryAction}</a>
              <a href={`/${locale}#system`}>{content.secondaryAction}</a>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
