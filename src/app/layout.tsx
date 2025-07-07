import type { Metadata, Viewport } from "next";
import { Poppins, Rock_Salt } from "next/font/google";
import "../styles/globals.css";
import Script from "next/script";

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
  description: "Your actions matters. Together, we take action for a cleaner planet.",
  manifest: "/manifest.json",
  themeColor: "#10B981",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "EnviroConnect",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1.0,
  maximumScale: 1.0,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="apple-touch-icon" sizes="192x192" href="/icons/icon-192x192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body
        className={`${poppins.variable} ${rockSalt.variable} font-sans antialiased`}
      >
        {children}
        <Script src="/registerSW.js" strategy="lazyOnload" />
      </body>
    </html>
  );
}
