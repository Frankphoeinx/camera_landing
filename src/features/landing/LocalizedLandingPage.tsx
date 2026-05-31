"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { HeroLanguageSwitcher, HeroScene } from "@/features/hero";
import { hasLocale, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { InstallationSection } from "./InstallationSection";
import { OrderPanel } from "./OrderPanel";
import { TechnicalScrollScene } from "./TechnicalScrollScene";

type LocalizedLandingPageProps = {
  dictionaries: Record<Locale, Dictionary>;
  initialLocale: Locale;
};

type AttributeSnapshot = {
  attributes?: Record<string, string | null>;
  index: number;
  selector: string;
  style?: Record<string, string>;
  textContent?: string | null;
};

type ControllerSnapshot = {
  elements: AttributeSnapshot[];
};

const heroMedia = {
  poster: "/media/images/hero-arrival-poster.86331ef3.webp",
  reverseSrc: "/media/videos/hero-arrival-reverse.430d00d5.mp4",
  reverseSrcWebm: "/media/videos/hero-arrival-reverse.c2fc64f1.webm",
  reverseToCapabilitySrc:
    "/media/videos/hero-arrival-reverse-10-to-4.742b1757.mp4",
  reverseToCapabilitySrcWebm:
    "/media/videos/hero-arrival-reverse-10-to-4.9313c13e.webm",
  reverseToOperationsSrc:
    "/media/videos/hero-arrival-reverse-final-to-10.3b1879c2.mp4",
  reverseToOperationsSrcWebm:
    "/media/videos/hero-arrival-reverse-final-to-10.35fadbe2.webm",
  src: "/media/videos/hero-arrival.7fdafa75.mp4",
  srcWebm: "/media/videos/hero-arrival.774f4cc9.webm",
};

const technicalMedia = {
  mp4Src: "/media/videos/camera-technical.ff528cc4.mp4",
  poster: "/media/images/camera-technical-poster.2dc1c5f8.webp",
  reverseMp4Src: "/media/videos/camera-technical-reverse.9c204762.mp4",
  reverseWebmSrc: "/media/videos/camera-technical-reverse.1c12908a.webm",
  webmSrc: "/media/videos/camera-technical.46fb894a.webm",
};

const attributeSelectors = [
  {
    attributes: ["data-scroll-cue-mode"],
    selector: "[data-hero-scene]",
  },
  {
    attributes: ["data-video-playing", "aria-hidden"],
    selector: "[data-language-switcher]",
  },
  {
    attributes: ["tabindex"],
    selector: "[data-language-switcher] a",
  },
  {
    attributes: [
      "data-active-step",
      "data-active-model",
      "data-active-model-step",
      "data-technical-mode",
    ],
    selector: "[data-technical-scene]",
  },
  {
    attributes: ["data-active", "aria-hidden"],
    selector: "[data-technical-panel]",
  },
  {
    attributes: ["data-active", "data-complete"],
    selector: "[data-technical-indicator]",
  },
  {
    attributes: ["aria-hidden"],
    selector: "[data-camera-model-interface]",
  },
  {
    attributes: ["data-active", "aria-hidden"],
    selector: "[data-camera-model-group]",
  },
  {
    attributes: ["data-active", "data-complete"],
    selector: "[data-camera-model-step-indicator]",
  },
  {
    attributes: ["data-active", "aria-hidden"],
    selector: "[data-camera-model-image]",
  },
] as const;

const textSelectors = [
  "[data-technical-current]",
  "[data-technical-total]",
  "[data-camera-model-step-current]",
  "[data-camera-model-step-total]",
] as const;

const styleSelectors = [
  "[data-technical-progress-fill]",
  "[data-camera-model-progress-fill]",
] as const;

function captureElements(
  selector: string,
  createSnapshot: (element: HTMLElement, index: number) => AttributeSnapshot,
) {
  return Array.from(document.querySelectorAll<HTMLElement>(selector)).map(
    createSnapshot,
  );
}

function captureControllerSnapshot(): ControllerSnapshot | null {
  if (typeof document === "undefined") {
    return null;
  }

  const elements = [
    ...attributeSelectors.flatMap(({ attributes, selector }) =>
      captureElements(selector, (element, index) => ({
        attributes: Object.fromEntries(
          attributes.map((attribute) => [
            attribute,
            element.getAttribute(attribute),
          ]),
        ),
        index,
        selector,
      })),
    ),
    ...textSelectors.flatMap((selector) =>
      captureElements(selector, (element, index) => ({
        index,
        selector,
        textContent: element.textContent,
      })),
    ),
    ...styleSelectors.flatMap((selector) =>
      captureElements(selector, (element, index) => ({
        index,
        selector,
        style: {
          transform: element.style.transform,
        },
      })),
    ),
  ];

  return { elements };
}

function restoreAttribute(
  element: HTMLElement,
  attribute: string,
  value: string | null,
) {
  if (value === null) {
    element.removeAttribute(attribute);
    return;
  }

  element.setAttribute(attribute, value);
}

function restoreControllerSnapshot(snapshot: ControllerSnapshot | null) {
  if (!snapshot || typeof document === "undefined") {
    return;
  }

  snapshot.elements.forEach((entry) => {
    const element = document.querySelectorAll<HTMLElement>(entry.selector)[
      entry.index
    ];

    if (!element) {
      return;
    }

    Object.entries(entry.attributes ?? {}).forEach(([attribute, value]) => {
      restoreAttribute(element, attribute, value);
    });

    if (entry.textContent !== undefined) {
      element.textContent = entry.textContent;
    }

    Object.entries(entry.style ?? {}).forEach(([property, value]) => {
      element.style.setProperty(property, value);
    });
  });
}

function syncHeroScrollCueCopy(content: Dictionary["hero"]["scrollCue"]) {
  const root = document.querySelector<HTMLElement>("[data-hero-scene]");
  const scrollCue = root?.querySelector<HTMLElement>("[data-scroll-cue]");
  const direction = root?.querySelector<HTMLElement>(
    "[data-scroll-cue-direction]",
  );
  const mode = root?.dataset.scrollCueMode;

  if (!root || !scrollCue || !direction || mode === "hidden") {
    return;
  }

  if (mode === "up") {
    scrollCue.setAttribute("aria-label", content.upAriaLabel);
    direction.textContent = content.upDirection;
    return;
  }

  scrollCue.setAttribute("aria-label", content.ariaLabel);
  direction.textContent = content.direction;
}

function syncDocumentLocale(locale: Locale, dictionary: Dictionary) {
  document.documentElement.lang = locale;

  if (typeof dictionary.metadata.title === "string") {
    document.title = dictionary.metadata.title;
  }

  if (dictionary.metadata.description) {
    let description = document.querySelector<HTMLMetaElement>(
      'meta[name="description"]',
    );

    if (!description) {
      description = document.createElement("meta");
      description.name = "description";
      document.head.append(description);
    }

    description.content = dictionary.metadata.description;
  }
}

function getLocaleFromPathname(pathname: string) {
  const [, localeSegment] = pathname.split("/");

  return localeSegment && hasLocale(localeSegment) ? localeSegment : null;
}

function getLocalizedPathname(pathname: string, locale: Locale) {
  const segments = pathname.split("/");

  if (segments.length > 1 && hasLocale(segments[1])) {
    segments[1] = locale;
    return segments.join("/") || `/${locale}`;
  }

  return `/${locale}${pathname === "/" ? "" : pathname}`;
}

export function LocalizedLandingPage({
  dictionaries,
  initialLocale,
}: LocalizedLandingPageProps) {
  const [locale, setLocale] = useState(initialLocale);
  const [isOrderPanelOpen, setIsOrderPanelOpen] = useState(false);
  const controllerSnapshotRef = useRef<ControllerSnapshot | null>(null);
  const dictionary = dictionaries[locale];

  const updateUrl = useCallback((nextLocale: Locale) => {
    const { hash, pathname, search } = window.location;
    const nextUrl = `${getLocalizedPathname(pathname, nextLocale)}${search}${hash}`;

    if (nextUrl !== `${pathname}${search}${hash}`) {
      window.history.pushState({ locale: nextLocale }, "", nextUrl);
    }
  }, []);

  const switchLocale = useCallback(
    (nextLocale: Locale) => {
      if (nextLocale === locale) {
        return;
      }

      controllerSnapshotRef.current = captureControllerSnapshot();
      setLocale(nextLocale);
      updateUrl(nextLocale);
    },
    [locale, updateUrl],
  );

  useLayoutEffect(() => {
    restoreControllerSnapshot(controllerSnapshotRef.current);
    controllerSnapshotRef.current = null;
    syncHeroScrollCueCopy(dictionary.hero.scrollCue);
  }, [dictionary]);

  useEffect(() => {
    syncDocumentLocale(locale, dictionary);
  }, [dictionary, locale]);

  useEffect(() => {
    const handlePopState = () => {
      const nextLocale = getLocaleFromPathname(window.location.pathname);

      if (!nextLocale || nextLocale === locale) {
        return;
      }

      controllerSnapshotRef.current = captureControllerSnapshot();
      setLocale(nextLocale);
    };

    window.addEventListener("popstate", handlePopState);

    return () => window.removeEventListener("popstate", handlePopState);
  }, [locale]);

  const languageSwitcherAriaLabel = useMemo(
    () => dictionary.hero.languageSwitcherAriaLabel,
    [dictionary.hero.languageSwitcherAriaLabel],
  );

  return (
    <main aria-label={dictionary.mainAriaLabel}>
      <HeroLanguageSwitcher
        ariaLabel={languageSwitcherAriaLabel}
        currentLocale={locale}
        onLocaleChange={switchLocale}
      />
      <HeroScene
        content={dictionary.hero}
        onOrderOpen={() => setIsOrderPanelOpen(true)}
        {...heroMedia}
      />
      <InstallationSection content={dictionary.installation} />
      <TechnicalScrollScene content={dictionary.technical} {...technicalMedia} />
      <OrderPanel
        content={dictionary.order}
        isOpen={isOrderPanelOpen}
        locale={locale}
        onClose={() => setIsOrderPanelOpen(false)}
      />
    </main>
  );
}
