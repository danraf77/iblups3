import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "iBlups - Plataforma de Streaming",
  description: "Plataforma de streaming moderna con canales en vivo, categorías y búsqueda avanzada",
  icons: {
    icon: "https://iblups.sfo3.cdn.digitaloceanspaces.com/app/iblups_icon2.png",
    shortcut: "https://iblups.sfo3.cdn.digitaloceanspaces.com/app/iblups_icon2.png",
    apple: "https://iblups.sfo3.cdn.digitaloceanspaces.com/app/iblups_icon2.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
