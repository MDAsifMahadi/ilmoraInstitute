import type { Metadata } from "next";
import { Hind_Siliguri, Poppins, Amiri } from "next/font/google";
import "./globals.css";
import { getSiteInfo } from "@/lib/site-data";
import WhatsAppButton from "@/components/WhatsAppButton";

const hindSiliguri = Hind_Siliguri({
  variable: "--font-hind-siliguri",
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin", "bengali"],
  display: "swap",
});

const poppins = Poppins({
  variable: "--font-poppins",
  weight: ["500", "600", "700", "800", "900"],
  subsets: ["latin"],
  display: "swap",
});

const amiri = Amiri({
  variable: "--font-amiri",
  weight: ["400", "700"],
  subsets: ["latin", "arabic"],
  display: "swap",
});

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const { SITE } = await getSiteInfo();

  return {
    title: {
      default: SITE.name,
      template: `%s | ${SITE.name}`,
    },
    description: SITE.description,
    keywords: [
      "ইলমুরা ইনস্টিটিউট",
      "Ilmora Institute",
      "কুরআন শিক্ষা",
      "কুরআন লার্নিং",
      "নূরানী",
      "তাজবীদ",
      "নাযিরা",
      "হিফজ",
      "আরবি ভাষা",
      "কুরআন কোর্স",
      "Quran Learning",
    ],
    icons: {
      icon: "/favicon.png",
    },
  };
}

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const { SITE } = await getSiteInfo();

  return (
    <html
      lang="bn"
      className={`${hindSiliguri.variable} ${poppins.variable} ${amiri.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        {children}
        <WhatsAppButton phone={SITE.whatsapp} />
      </body>
    </html>
  );
}
