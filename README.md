# Camera Landing

Premium landing page for a solar outdoor security camera product.

## Stack

- Next.js App Router
- React
- TypeScript
- CSS Modules
- GSAP
- ESLint

## Asset folders

- `public/media/videos` - hero and product tour videos
- `public/media/images` - stills, posters, and supporting product imagery

## Scripts

```bash
npm run dev
npm run build
npm run lint
```

## Order Email

The order form sends requests through the Resend REST API.

Required production environment variables:

```bash
RESEND_API_KEY=
ORDER_EMAIL_FROM=
```

Optional:

```bash
ORDER_EMAIL_TO=frenkmillon@gmail.com
```
