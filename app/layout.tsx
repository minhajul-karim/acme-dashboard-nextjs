import "@/app/ui/global.css";
import { montserrat } from "@/app/ui/fonts";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Acme dashboard",
  description: "The extended version of the Next.js Course Dashboard, built with App Router.",
  metadataBase: new URL("https://acme-dashboard-nextjs-chi.vercel.app")
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${montserrat.className} antialiased`}>{children}</body>
    </html>
  );
}
