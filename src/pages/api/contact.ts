import { Resend } from 'resend';
import type { APIRoute } from 'astro';

const RESEND_API_KEY = import.meta.env.RESEND_API_KEY;

const TO_EMAIL =
  (import.meta.env.CONTACT_TO_EMAIL as string | undefined) ||
  'aungphonemyat2323@gmail.com';

const FROM_EMAIL =
  (import.meta.env.CONTACT_FROM_EMAIL as string | undefined) ||
  'onboarding@resend.dev';

const ALLOWED_ORIGINS = (() => {
  const raw = import.meta.env.CONTACT_ALLOWED_ORIGINS as string | undefined;
  if (!raw) return undefined;
  return raw.split(',').map((s) => s.trim()).filter(Boolean);
})();

function isEmail(input: unknown): input is string {
  if (typeof input !== 'string') return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input);
}

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  const origin = request.headers.get('origin');

  if (ALLOWED_ORIGINS && origin && !ALLOWED_ORIGINS.includes(origin)) {
    return new Response(
      JSON.stringify({
        ok: false,
        error: 'Origin not allowed',
      }),
      {
        status: 403,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }

  if (!RESEND_API_KEY) {
    return new Response(
      JSON.stringify({
        ok: false,
        error: 'RESEND_API_KEY is not configured on the server.',
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...(origin ? { 'Access-Control-Allow-Origin': origin } : {}),
        },
      }
    );
  }

  let payload: { name?: unknown; email?: unknown; message?: unknown };
  try {
    payload = (await request.json()) as typeof payload;
    if (!payload || typeof payload !== 'object') throw new Error('invalid body');
  } catch (err) {
    return new Response(
      JSON.stringify({
        ok: false,
        error: 'Invalid JSON body',
      }),
      {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          ...(origin ? { 'Access-Control-Allow-Origin': origin } : {}),
        },
      }
    );
  }

  const name = typeof payload.name === 'string' ? payload.name.trim() : '';
  const email = typeof payload.email === 'string' ? payload.email.trim() : '';
  const message = typeof payload.message === 'string' ? payload.message.trim() : '';

  if (!name || name.length < 2) {
    return new Response(
      JSON.stringify({
        ok: false,
        error: 'Please enter your name (at least 2 characters).',
        field: 'name',
      }),
      {
        status: 422,
        headers: {
          'Content-Type': 'application/json',
          ...(origin ? { 'Access-Control-Allow-Origin': origin } : {}),
        },
      }
    );
  }

  if (!isEmail(email)) {
    return new Response(
      JSON.stringify({
        ok: false,
        error: 'Please enter a valid email address.',
        field: 'email',
      }),
      {
        status: 422,
        headers: {
          'Content-Type': 'application/json',
          ...(origin ? { 'Access-Control-Allow-Origin': origin } : {}),
        },
      }
    );
  }

  if (!message || message.length < 5) {
    return new Response(
      JSON.stringify({
        ok: false,
        error: 'Please enter a message (at least 5 characters).',
        field: 'message',
      }),
      {
        status: 422,
        headers: {
          'Content-Type': 'application/json',
          ...(origin ? { 'Access-Control-Allow-Origin': origin } : {}),
        },
      }
    );
  }

  if (message.length > 10_000) {
    return new Response(
      JSON.stringify({
        ok: false,
        error: 'Message is too long. Please keep it under 10,000 characters.',
        field: 'message',
      }),
      {
        status: 413,
        headers: {
          'Content-Type': 'application/json',
          ...(origin ? { 'Access-Control-Allow-Origin': origin } : {}),
        },
      }
    );
  }

  try {
    const resend = new Resend(RESEND_API_KEY);

    const subject = `[Portfolio] New message from ${name}`;
    const replyTo = `${name} <${email}>`;

    const textVersion = [
      `New contact form submission from your portfolio website.`,
      ``,
      `Name: ${name}`,
      `Email: ${email}`,
      ``,
      `Message:`,
      `---`,
      message,
      `---`,
    ].join('\n');

    const htmlVersion = `
      <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;max-width:640px;margin:0 auto;padding:24px;color:#111;">
        <div style="padding:16px 20px;border-radius:12px;background:linear-gradient(135deg,#fdf4ff 0%,#fff1f2 100%);border:1px solid #fce7f3;">
          <p style="margin:0 0 8px;font-size:13px;color:#9d174d;font-weight:600;letter-spacing:0.02em;">NEW MESSAGE · PORTFOLIO</p>
          <h1 style="margin:0;font-size:22px;line-height:1.3;color:#831843;">You've got a new message from <strong>${name.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</strong></h1>
        </div>

        <div style="margin-top:24px;display:grid;grid-template-columns:80px 1fr;gap:8px 16px;">
          <div style="font-size:13px;color:#6b7280;font-weight:600;">Name</div>
          <div style="font-size:15px;color:#111;">${name.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</div>

          <div style="font-size:13px;color:#6b7280;font-weight:600;">Email</div>
          <div style="font-size:15px;color:#111;"><a href="mailto:${email}" style="color:#4338ca;">${email.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</a></div>
        </div>

        <div style="margin-top:24px;padding:20px;border-radius:12px;background:#fafafa;border:1px solid #f0f0f0;">
          <div style="font-size:12px;color:#6b7280;font-weight:600;letter-spacing:0.04em;text-transform:uppercase;margin-bottom:10px;">Message</div>
          <div style="font-size:15px;line-height:1.6;color:#111;white-space:pre-wrap;word-break:break-word;">${message.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</div>
        </div>

        <div style="margin-top:24px;font-size:12px;color:#9ca3af;">
          Reply to this message directly to write back to ${name.replace(/</g, '&lt;').replace(/>/g, '&gt;')} at ${email.replace(/</g, '&lt;').replace(/>/g, '&gt;')}.
        </div>
      </div>
    `.trim();

    const sendResult = await resend.emails.send({
      from: FROM_EMAIL,
      to: [TO_EMAIL],
      subject,
      reply_to: [replyTo],
      text: textVersion,
      html: htmlVersion,
    });

    if (sendResult && (sendResult as any).error) {
      const err = (sendResult as any).error;
      console.error('[resend] send error:', err);
      return new Response(
        JSON.stringify({
          ok: false,
          error:
            typeof err === 'object' && err?.message
              ? String(err.message)
              : 'Failed to send email via Resend.',
        }),
        {
          status: 502,
          headers: {
            'Content-Type': 'application/json',
            ...(origin ? { 'Access-Control-Allow-Origin': origin } : {}),
          },
        }
      );
    }

    return new Response(
      JSON.stringify({
        ok: true,
        message: 'Message sent successfully.',
        id: sendResult?.data?.id ?? undefined,
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          ...(origin ? { 'Access-Control-Allow-Origin': origin } : {}),
        },
      }
    );
  } catch (err: unknown) {
    console.error('[api/contact] unexpected error:', err);
    const msg =
      err instanceof Error && import.meta.env.DEV
        ? err.message
        : 'Something went wrong while sending your message. Please try again later.';
    return new Response(
      JSON.stringify({ ok: false, error: msg }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...(origin ? { 'Access-Control-Allow-Origin': origin } : {}),
        },
      }
    );
  }
};

export const OPTIONS: APIRoute = ({ request }) => {
  const origin = request.headers.get('origin');
  return new Response(null, {
    status: 204,
    headers: {
      Allow: 'POST, OPTIONS',
      'Access-Control-Allow-Origin': origin || '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400',
    },
  });
};
