import type { Metadata } from "next";
import { Chakra_Petch } from "next/font/google";
import "./globals.css";

const inter = Chakra_Petch({
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} relative w-screen h-screen overflow-hidden`}
      >
        {children}
      </body>
    </html>
  );
}
