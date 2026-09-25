const WHATSAPP_MESSAGE =
  "আসসালামু আলাইকুম, আমি ইলমুরা ইনস্টিটিউট সম্পর্কে জানতে চাই।";

function getWhatsAppDigits(phone: string): string | null {
  const normalized = phone.trim();

  // Do not render a broken link for placeholder values such as +880 1XXX-XXXXXX.
  if (!/^\+?[\d\s().-]+$/.test(normalized)) return null;

  const digits = normalized.replace(/\D/g, "");
  return /^\d{8,15}$/.test(digits) ? digits : null;
}

function WhatsAppIcon() {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.87 9.87 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91C21.96 6.45 17.5 2 12.04 2Zm0 18.02h-.01a8.2 8.2 0 0 1-4.18-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.17 8.17 0 0 1-1.26-4.36c0-4.52 3.68-8.2 8.2-8.2 2.19 0 4.24.85 5.79 2.4a8.13 8.13 0 0 1 2.4 5.8c0 4.52-3.68 8.2-8.2 8.2Zm4.52-6.16c-.25-.12-1.47-.72-1.69-.8-.23-.08-.39-.12-.56.12-.16.25-.64.8-.78.97-.14.16-.29.18-.54.06-.25-.12-1.05-.39-2-1.23-.74-.66-1.24-1.47-1.38-1.72-.14-.25-.01-.38.11-.5.11-.11.25-.29.37-.43.12-.14.16-.25.25-.41.08-.16.04-.31-.02-.43-.06-.12-.56-1.35-.77-1.85-.2-.49-.4-.42-.56-.43h-.48c-.17 0-.43.06-.66.31-.23.25-.87.85-.87 2.08s.89 2.41 1.02 2.58c.12.16 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.12.16 1.54.1.47-.07 1.47-.6 1.68-1.18.2-.58.2-1.07.14-1.18-.06-.11-.23-.17-.48-.29Z" />
    </svg>
  );
}

export default function WhatsAppButton({ phone }: { phone: string }) {
  const digits = getWhatsAppDigits(phone);
  if (!digits) return null;

  const href = `https://wa.me/${digits}?text=${encodeURIComponent(
    WHATSAPP_MESSAGE
  )}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="হোয়াটসঅ্যাপে মেসেজ করুন"
      className="group fixed bottom-4 right-4 z-50 inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_10px_30px_rgba(37,211,102,0.35)] transition-all duration-200 hover:-translate-y-1 hover:bg-[#1eb455] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-green-200 sm:bottom-6 sm:right-6"
    >
      <WhatsAppIcon />
    </a>
  );
}
