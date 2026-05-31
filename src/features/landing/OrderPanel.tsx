"use client";

import {
  useEffect,
  useId,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent as ReactKeyboardEvent,
  type TouchEvent,
  type WheelEvent,
} from "react";

import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import styles from "./OrderPanel.module.css";

type OrderPanelProps = {
  content: Dictionary["order"];
  isOpen: boolean;
  locale: Locale;
  onClose: () => void;
};

type OrderFormValues = {
  city: string;
  comments: string;
  contactMethod: string;
  email: string;
  name: string;
  phone: string;
  propertyType: string;
  siteArea: string;
  website: string;
};

const initialFormValues: OrderFormValues = {
  city: "",
  comments: "",
  contactMethod: "phone",
  email: "",
  name: "",
  phone: "",
  propertyType: "private-estate",
  siteArea: "",
  website: "",
};

export function OrderPanel({
  content,
  isOpen,
  locale,
  onClose,
}: OrderPanelProps) {
  const titleId = useId();
  const firstFieldRef = useRef<HTMLInputElement>(null);
  const [formValues, setFormValues] = useState(initialFormValues);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const originalOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";
    firstFieldRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  const updateField = (field: keyof OrderFormValues, value: string) => {
    setFormValues((currentValues) => ({
      ...currentValues,
      [field]: value,
    }));
  };

  const handleBackdropWheel = (event: WheelEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleBackdropTouchMove = (event: TouchEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const stopPanelPointerEvent = (
    event: TouchEvent<HTMLElement> | WheelEvent<HTMLElement>,
  ) => {
    event.stopPropagation();
  };

  const handlePanelKeyDown = (event: ReactKeyboardEvent<HTMLElement>) => {
    event.stopPropagation();

    if (event.key === "Escape") {
      onClose();
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/orders", {
        body: JSON.stringify({
          ...formValues,
          locale,
          pageUrl: window.location.href,
        }),
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      });
      const payload = (await response.json().catch(() => null)) as
        | { requestId?: string }
        | null;

      if (!response.ok) {
        throw new Error("Order request failed");
      }

      const requestId = payload?.requestId
        ? `?request=${encodeURIComponent(payload.requestId)}`
        : "";

      window.location.assign(`/${locale}/thank-you${requestId}`);
    } catch {
      setErrorMessage(content.errors.submit);
      setIsSubmitting(false);
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className={styles.backdrop}
      onTouchMove={handleBackdropTouchMove}
      onWheel={handleBackdropWheel}
      role="presentation"
    >
      <button
        className={styles.backdropButton}
        aria-label={content.closeLabel}
        onClick={onClose}
        type="button"
      />

      <section
        className={styles.panel}
        aria-labelledby={titleId}
        aria-modal="true"
        onKeyDown={handlePanelKeyDown}
        onTouchMove={stopPanelPointerEvent}
        onTouchStart={stopPanelPointerEvent}
        onWheel={stopPanelPointerEvent}
        role="dialog"
      >
        <div className={styles.frame} aria-hidden="true">
          <span className={styles.cornerTop} />
          <span className={styles.cornerBottom} />
          <span className={styles.scanLine} />
        </div>

        <button
          className={styles.closeButton}
          aria-label={content.closeLabel}
          onClick={onClose}
          type="button"
        >
          <span />
          <span />
        </button>

        <div className={styles.panelScroller}>
          <div className={styles.header}>
            <p className={styles.eyebrow}>{content.eyebrow}</p>
            <h2 id={titleId}>{content.title}</h2>
            <p>{content.copy}</p>
          </div>

          <form className={styles.form} onSubmit={handleSubmit}>
            <input
              aria-hidden="true"
              autoComplete="off"
              className={styles.honeypot}
              name="website"
              onChange={(event) => updateField("website", event.target.value)}
              tabIndex={-1}
              value={formValues.website}
            />

            <div className={styles.sectionHeader}>
              <span>01</span>
              <strong>{content.contactSection}</strong>
            </div>

            <label className={styles.field}>
              <span>{content.fields.name.label}</span>
              <input
                autoComplete="name"
                maxLength={80}
                onChange={(event) => updateField("name", event.target.value)}
                placeholder={content.fields.name.placeholder}
                ref={firstFieldRef}
                required
                value={formValues.name}
              />
            </label>

            <div className={styles.fieldGrid}>
              <label className={styles.field}>
                <span>{content.fields.phone.label}</span>
                <input
                  autoComplete="tel"
                  maxLength={40}
                  onChange={(event) => updateField("phone", event.target.value)}
                  placeholder={content.fields.phone.placeholder}
                  required
                  type="tel"
                  value={formValues.phone}
                />
              </label>

              <label className={styles.field}>
                <span>{content.fields.email.label}</span>
                <input
                  autoComplete="email"
                  maxLength={120}
                  onChange={(event) => updateField("email", event.target.value)}
                  placeholder={content.fields.email.placeholder}
                  required
                  type="email"
                  value={formValues.email}
                />
              </label>
            </div>

            <div className={styles.sectionHeader}>
              <span>02</span>
              <strong>{content.siteSection}</strong>
            </div>

            <div className={styles.fieldGrid}>
              <label className={styles.field}>
                <span>{content.fields.city.label}</span>
                <input
                  autoComplete="address-level2"
                  maxLength={80}
                  onChange={(event) => updateField("city", event.target.value)}
                  placeholder={content.fields.city.placeholder}
                  required
                  value={formValues.city}
                />
              </label>

              <label className={styles.field}>
                <span>{content.fields.propertyType.label}</span>
                <select
                  onChange={(event) =>
                    updateField("propertyType", event.target.value)
                  }
                  required
                  value={formValues.propertyType}
                >
                  {content.propertyTypes.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <label className={styles.field}>
              <span>{content.fields.siteArea.label}</span>
              <input
                maxLength={140}
                onChange={(event) =>
                  updateField("siteArea", event.target.value)
                }
                placeholder={content.fields.siteArea.placeholder}
                value={formValues.siteArea}
              />
            </label>

            <div className={styles.sectionHeader}>
              <span>03</span>
              <strong>{content.requestSection}</strong>
            </div>

            <label className={styles.field}>
              <span>{content.fields.contactMethod.label}</span>
              <select
                onChange={(event) =>
                  updateField("contactMethod", event.target.value)
                }
                required
                value={formValues.contactMethod}
              >
                {content.contactMethods.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <label className={styles.field}>
              <span>{content.fields.comments.label}</span>
              <textarea
                maxLength={900}
                onChange={(event) =>
                  updateField("comments", event.target.value)
                }
                placeholder={content.fields.comments.placeholder}
                rows={4}
                value={formValues.comments}
              />
            </label>

            <div className={styles.footer}>
              <p>{content.privacyNote}</p>
              {errorMessage ? (
                <span className={styles.error} role="alert">
                  {errorMessage}
                </span>
              ) : null}
              <button
                className={styles.submitButton}
                disabled={isSubmitting}
                type="submit"
              >
                <span>{isSubmitting ? content.submitting : content.submit}</span>
              </button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}
