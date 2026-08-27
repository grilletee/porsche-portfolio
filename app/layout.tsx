import type { Metadata } from "next";
import { JetBrains_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "700"],
  variable: "--font-space-grotesk",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-jetbrains-mono",
});

// SEO / metadata (Sprint 12C).
export const metadata: Metadata = {
  metadataBase: new URL("https://www.grillete.dev"),
  title: "Guillermo Sánchez — Full Stack Developer, Backend & IoT",
  description:
    "Full Stack Developer con foco en backend, IoT e inteligencia artificial aplicada. Java, Spring Boot, Python, React, Arduino.",
  keywords: [
    "full stack developer",
    "backend developer",
    "IoT",
    "Arduino",
    "Spring Boot",
    "React",
    "inteligencia artificial",
    "portfolio desarrollador",
  ],
  openGraph: {
    title: "Guillermo Sánchez — Full Stack Developer, Backend & IoT",
    description:
      "Full Stack Developer con foco en backend, IoT e inteligencia artificial aplicada. Java, Spring Boot, Python, React, Arduino.",
    url: "https://www.grillete.dev",
    siteName: "Guillermo Sánchez — Portfolio",
    images: ["/og-image.jpg"],
    locale: "es_ES",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Guillermo Sánchez — Full Stack Developer, Backend & IoT",
    description:
      "Full Stack Developer con foco en backend, IoT e inteligencia artificial aplicada. Java, Spring Boot, Python, React, Arduino.",
    images: ["/og-image.jpg"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="es"
      className={`${spaceGrotesk.variable} ${jetbrainsMono.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
