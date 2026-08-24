import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Guillermo Sánchez — Portfolio",
  description: "Full Stack Developer — Backend, IoT & IA Aplicada",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
