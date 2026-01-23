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
  title: "Bug Survivor - Sobreviva ao Caos Digital",
  description: "Um jogo survivors-like ambientado em um mundo cyberpunk. Sobreviva a ondas infinitas de bugs digitais, colete XP, evolua suas armas e domine o sistema!",
  keywords: ["bug survivor", "survivors-like", "cyberpunk", "game", "javascript", "nextjs", "roguelike"],
  authors: [{ name: "Vinicius Pascoal" }],
  creator: "Vinicius Pascoal",
  openGraph: {
    title: "Bug Survivor - Sobreviva ao Caos Digital",
    description: "Sobreviva a ondas infinitas de bugs digitais em um mundo cyberpunk. Colete XP, evolua suas armas e domine o sistema!",
    type: "website",
    locale: "pt_BR",
  },
  twitter: {
    card: "summary_large_image",
    title: "Bug Survivor - Sobreviva ao Caos Digital",
    description: "Sobreviva a ondas infinitas de bugs digitais em um mundo cyberpunk. Colete XP, evolua suas armas e domine o sistema!",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
