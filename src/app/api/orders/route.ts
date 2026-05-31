import { NextResponse } from "next/server";

import { hasLocale, type Locale } from "@/i18n/config";

export const runtime = "nodejs";

const RESEND_EMAIL_ENDPOINT = "https://api.resend.com/emails";
const REQUEST_BODY_LIMIT_BYTES = 16_384;
const DEFAULT_ORDER_EMAIL_TO = "frenkmillon@gmail.com";

const allowedContactMethods = new Set([
  "email",
  "phone",
  "telegram",
  "whatsapp",
]);
const allowedPropertyTypes = new Set([
  "commercial-site",
  "private-estate",
  "remote-perimeter",
  "villa-house",
]);

type OrderPayload = {
  city: string;
  comments: string;
  contactMethod: string;
  email: string;
  locale: Locale;
  name: string;
  pageUrl: string;
  phone: string;
  propertyType: string;
  siteArea: string;
  website?: string;
};

type ValidationResult =
  | {
      order: OrderPayload;
      ok: true;
    }
  | {
      code: string;
      ok: false;
      status: number;
    };

function getString(value: unknown, maxLength: number) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function validatePayload(payload: unknown): ValidationResult {
  if (!payload || typeof payload !== "object") {
    return { code: "invalid_payload", ok: false, status: 400 };
  }

  const record = payload as Record<string, unknown>;
  const locale = getString(record.locale, 8);
  const order = {
    city: getString(record.city, 80),
    comments: getString(record.comments, 900),
    contactMethod: getString(record.contactMethod, 40),
    email: getString(record.email, 120).toLowerCase(),
    locale: hasLocale(locale) ? locale : "en",
    name: getString(record.name, 80),
    pageUrl: getString(record.pageUrl, 500),
    phone: getString(record.phone, 40),
    propertyType: getString(record.propertyType, 40),
    siteArea: getString(record.siteArea, 140),
    website: getString(record.website, 120),
  };

  if (order.website) {
    return { order, ok: true };
  }

  if (!order.name || !order.phone || !order.email || !order.city) {
    return { code: "missing_required_fields", ok: false, status: 400 };
  }

  if (!isEmail(order.email)) {
    return { code: "invalid_email", ok: false, status: 400 };
  }

  if (!allowedContactMethods.has(order.contactMethod)) {
    return { code: "invalid_contact_method", ok: false, status: 400 };
  }

  if (!allowedPropertyTypes.has(order.propertyType)) {
    return { code: "invalid_property_type", ok: false, status: 400 };
  }

  return { order, ok: true };
}

function createRequestId() {
  return `ORD-${Date.now().toString(36).toUpperCase()}-${crypto
    .randomUUID()
    .slice(0, 8)
    .toUpperCase()}`;
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function createEmailText(order: OrderPayload, requestId: string) {
  return [
    `New camera installation request: ${requestId}`,
    "",
    `Name: ${order.name}`,
    `Phone: ${order.phone}`,
    `Email: ${order.email}`,
    `City / area: ${order.city}`,
    `Property type: ${order.propertyType}`,
    `Install zone: ${order.siteArea || "Not specified"}`,
    `Preferred contact: ${order.contactMethod}`,
    `Locale: ${order.locale}`,
    `Page URL: ${order.pageUrl || "Not specified"}`,
    "",
    "Comment:",
    order.comments || "Not specified",
  ].join("\n");
}

function createEmailHtml(order: OrderPayload, requestId: string) {
  const rows = [
    ["Name", order.name],
    ["Phone", order.phone],
    ["Email", order.email],
    ["City / area", order.city],
    ["Property type", order.propertyType],
    ["Install zone", order.siteArea || "Not specified"],
    ["Preferred contact", order.contactMethod],
    ["Locale", order.locale],
    ["Page URL", order.pageUrl || "Not specified"],
  ];

  return `
    <div style="font-family:Inter,Arial,sans-serif;color:#16110a;line-height:1.5">
      <p style="margin:0 0 8px;color:#9c6527;font-size:12px;font-weight:700;letter-spacing:.12em;text-transform:uppercase">Camera Landing</p>
      <h1 style="margin:0 0 18px;font-size:24px;line-height:1.15">New installation request</h1>
      <p style="margin:0 0 18px"><strong>Request ID:</strong> ${escapeHtml(requestId)}</p>
      <table style="border-collapse:collapse;width:100%;max-width:640px">
        <tbody>
          ${rows
            .map(
              ([label, value]) => `
                <tr>
                  <td style="padding:8px 10px;border:1px solid #ead9bd;background:#fff8ec;font-weight:700">${escapeHtml(label)}</td>
                  <td style="padding:8px 10px;border:1px solid #ead9bd">${escapeHtml(value)}</td>
                </tr>
              `,
            )
            .join("")}
        </tbody>
      </table>
      <h2 style="margin:22px 0 8px;font-size:16px">Comment</h2>
      <p style="margin:0;white-space:pre-wrap">${escapeHtml(order.comments || "Not specified")}</p>
    </div>
  `;
}

export async function POST(request: Request) {
  const contentLength = Number(request.headers.get("content-length") ?? 0);

  if (contentLength > REQUEST_BODY_LIMIT_BYTES) {
    return NextResponse.json(
      { code: "payload_too_large" },
      { status: 413 },
    );
  }

  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ code: "invalid_json" }, { status: 400 });
  }

  const validation = validatePayload(payload);

  if (!validation.ok) {
    return NextResponse.json(
      { code: validation.code },
      { status: validation.status },
    );
  }

  const requestId = createRequestId();

  if (validation.order.website) {
    return NextResponse.json({ ok: true, requestId });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.ORDER_EMAIL_FROM;
  const to = process.env.ORDER_EMAIL_TO ?? DEFAULT_ORDER_EMAIL_TO;

  if (!apiKey || !from) {
    return NextResponse.json(
      { code: "email_not_configured" },
      { status: 500 },
    );
  }

  const resendResponse = await fetch(RESEND_EMAIL_ENDPOINT, {
    body: JSON.stringify({
      from,
      html: createEmailHtml(validation.order, requestId),
      reply_to: validation.order.email,
      subject: `New camera installation request - ${requestId}`,
      text: createEmailText(validation.order, requestId),
      to: [to],
    }),
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    method: "POST",
  });

  if (!resendResponse.ok) {
    return NextResponse.json({ code: "email_failed" }, { status: 502 });
  }

  return NextResponse.json({ ok: true, requestId });
}
