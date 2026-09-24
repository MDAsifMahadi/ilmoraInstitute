import { getSiteInfo } from "@/lib/site-data";
import AdminLayoutClient from "./AdminLayoutClient";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { SITE, LOGO_NAV } = await getSiteInfo();

  return (
    <AdminLayoutClient site={SITE} logoNav={LOGO_NAV}>
      {children}
    </AdminLayoutClient>
  );
}