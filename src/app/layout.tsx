import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import Script from "next/dist/client/script";

export const metadata: Metadata = {
  title: {
    template: "%s | GD Pâtisserie", // %s sera remplacé par le titre des autres pages
    default: "GD Pâtisserie - Artisan Pâtissier à Marseille",
  },
  description:
    "Découvrez nos pâtisseries et chocolats artisanaux. Commandez en ligne et faites-vous livrer à Marseille. Fraîcheur garantie.",
  keywords: [
    "pâtisserie",
    "marseille",
    "gâteaux",
    "chocolat",
    "livraison",
    "artisan",
  ],
  openGraph: {
    title: "GD Pâtisserie - Artisan Pâtissier",
    description: "Le meilleur de la pâtisserie livré chez vous.",
    url: "https://gdpatisserie.fr", // Mettre la vraie URL plus tard
    siteName: "GD Pâtisserie",
    locale: "fr_FR",
    type: "website",
  },
  icons: {
    icon: [
      {
        url: "/favicon.ico",
        href: "/favicon.ico",
      },
    ],
  },
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <Script
          src="https://stats-visites.calliste.ovh/script.js"
          data-website-id="6a3f2736-695a-4074-9325-60835c3aaca9"
          strategy="afterInteractive"
        />
      </head>
      <body
        className={
          `${geistSans.variable} ${geistMono.variable} antialiased` +
          "min-h-screen"
        }
      >
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
