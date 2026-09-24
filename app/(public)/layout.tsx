import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { getSiteInfo } from "@/lib/site-data";

export const dynamic = "force-dynamic";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { SITE, LOGO, LOGO_NAV } = await getSiteInfo();

  return (
    <>
      <SiteHeader site={SITE} logo={LOGO} />
      <main className="flex-1">{children}</main>
      <SiteFooter site={SITE} logoNav={LOGO_NAV} />
    </>
  );
}