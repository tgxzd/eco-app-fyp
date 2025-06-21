import type { Metadata } from "next";
import { Poppins, Rock_Salt } from "next/font/google";
import "../styles/globals.css";

const poppins = Poppins({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ["latin"],
  variable: "--font-poppins",
});

const rockSalt = Rock_Salt({
  weight: ['400'],
  subsets: ["latin"],
  variable: "--font-rock-salt",
});

export const metadata: Metadata = {
  title: "EnviroConnect",
  description: "Jagalah Alam Sekitar",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${poppins.variable} ${rockSalt.variable} font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
