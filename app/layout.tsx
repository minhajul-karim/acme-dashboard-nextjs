import "@/app/ui/global.css";
import { montserrat } from "@/app/ui/fonts";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    template: "%s | Acme dashboard",
    default: "Acme dashboard",
  },
  description:
    "An app for managing invoices, tracking analytics, and handling customer data, inspired by the Next.js Learn Course example.",
  metadataBase: new URL("https://acme-dashboard-nextjs-chi.vercel.app"),
};

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
