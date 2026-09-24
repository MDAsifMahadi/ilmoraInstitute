This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Teacher photo uploads

Open **Admin → Site Content → Teachers**, then use **Photo** while adding or editing a teacher. Photos are stored in Cloudinary and displayed on the homepage and `/teachers`; teachers without a photo continue to show their initials.

Configure these environment variables before uploading:

```env
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
```

If any value is missing, the admin panel shows the exact missing variable instead of showing a generic upload failure. Restart the development server after changing `.env`.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Initial database data

The canonical demo content lives in `lib/site.ts`. To synchronize the Prisma schema and import that content into an empty database, run:

```bash
npm run db:setup
```

The seed is intentionally non-destructive: existing site-content collections and the site settings row are preserved, so later edits made from `/admin/site` are not overwritten by another seed run.

## Site Content audit behavior

All eight Site Content collections support authenticated create, edit, and delete operations. Image fields accept only managed local paths or Cloudinary URLs; invalid URLs, unknown fields, malformed JSON, and invalid required values return a client error instead of a Prisma 500. Removing an image or deleting its record also performs best-effort Cloudinary cleanup, and abandoning an uncommitted upload cleans up the pending asset.

The hero Arabic line is editable from **Admin → Site Content → Settings → Hero Arabic Line**. The value is stored in MongoDB and rendered on the homepage.

## Teacher and testimonial image uploads

Teacher photos are managed from **Admin → Site Content → Teachers**. Student and guardian photos are managed from **Admin → Site Content → Testimonials**. Uploads require all three Cloudinary variables in `.env`:

```bash
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
```

The dashboard accepts JPG, PNG, WebP, and GIF files up to 5 MB, shows a preview, and stores the returned Cloudinary URL in MongoDB. The homepage hero image is managed from **Admin → Site Content → Settings → Hero Image**. Testimonial photos appear as circular avatars on the homepage; if no photo is provided, the person's initials are shown instead.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
"# ilmoraInstitute" 
