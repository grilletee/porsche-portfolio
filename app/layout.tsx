import type { Metadata, Viewport } from "next";
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

const SITE_URL = "https://www.grillete.dev";
const TITLE = "Guillermo Sánchez — Desarrollador Full Stack | Backend, IoT e IA aplicada";
const DESCRIPTION =
  "Técnico Superior en DAM y alumno del Máster en IA y Big Data. Backend con Java y Spring Boot, IA aplicada con Python y FastAPI, e IoT con Arduino. Portfolio con proyectos y CV.";

// SEO / metadata. themeColor vive en `viewport` desde Next 14 (en
// `metadata` generaba un aviso en cada build).
export const viewport: Viewport = {
  themeColor: "#050505",
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/" },
  keywords: [
    "desarrollador full stack",
    "backend developer",
    "Spring Boot",
    "Java",
    "Python",
    "FastAPI",
    "IoT",
    "Arduino",
    "inteligencia artificial aplicada",
    "portfolio desarrollador",
  ],
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: SITE_URL,
    siteName: "Guillermo Sánchez — Portfolio",
    images: [
      {
        url: "/og-image.jpg",
        alt: "Portfolio de Guillermo Sánchez: recorrido 3D por su stack de desarrollo",
      },
    ],
    locale: "es_ES",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: ["/og-image.jpg"],
  },
};

// Datos estructurados (schema.org/Person): solo información que ya es
// pública en el propio portfolio y en el CV.
const PERSON_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Guillermo Sánchez Gutiérrez",
  alternateName: "Grillete",
  url: SITE_URL,
  jobTitle: "Desarrollador Full Stack",
  address: { "@type": "PostalAddress", addressLocality: "Madrid", addressCountry: "ES" },
  sameAs: [
    "https://github.com/grilletee",
    "https://www.linkedin.com/in/guillermo-sanchez-gutierrez/",
  ],
  knowsAbout: ["Java", "Spring Boot", "Python", "FastAPI", "Angular", "React", "Arduino", "IoT"],
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
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(PERSON_JSON_LD) }}
        />
        <a href="#proyectos" className="skip-link">
          Saltar a los proyectos
        </a>
        {children}
      </body>
    </html>
  );
}
