import type { Metadata } from "next";
import { Toaster } from "sonner";
import "./globals.css";
import localFont from "next/font/local";

export const metadata: Metadata = {
  title: "VOUZ",
  description:
    "Vouz is an open-source file sharing application that requires no login. Enjoy a hasle free file sharing experience.",
  openGraph: {
    images: ["/assets/meta-image.png"],
  },
};

const helvetica = localFont({
  src: [
    {
      path: "../../fonts/helvetica/HelveticaNowDisplay-Thin.woff2",
      weight: "100",
      style: "normal",
    },
    {
      path: "../../fonts/helvetica/HelveticaNowDisplay-Regular.woff2",
      weight: "200",
      style: "normal",
    },
    {
      path: "../../fonts/helvetica/HelveticaNowDisplay-Medium.woff2",
      weight: "300",
      style: "normal",
    },
    {
      path: "../../fonts/helvetica/HelveticaNowDisplay-Bold.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../fonts/helvetica/HelveticaNowDisplay-ExtraBold.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../fonts/helvetica/HelveticaNowDisplay-Black.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "../../fonts/helvetica/HelveticaNowDisplay-ExtBlk.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-helvetica",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${helvetica.variable} antialiased helvetica`}>
        <Toaster position="bottom-left" richColors closeButton />
        {children}
      </body>
    </html>
  );
}
