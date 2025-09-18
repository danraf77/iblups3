import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

import I18nProvider from "./components/I18nProvider";

// Usar Poppins como fuente principal (TASA Orbiter no está disponible en next/font/google)
const poppins = Poppins({
  variable: "--font-tasa-orbiter",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "iblups - Streaming Platform",
  description: "Modern streaming platform with live channels, categories and advanced search",
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
    <html lang="en">
      <body
        className={`${poppins.variable} antialiased`}
        style={{ fontFamily: "'TASA Orbiter', var(--font-tasa-orbiter), sans-serif" }}
      >
        <I18nProvider>
          {children}
        </I18nProvider>
      </body>
    </html>
  );
}
