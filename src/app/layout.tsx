import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Navbar } from "@/components/navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "郭大队的博客",
  description: "分享交易经验与生活思考",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className={`${inter.className} antialiased min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-blue-100/20`}>
        <Providers>
          <Navbar />
          <main className="container mx-auto px-4 py-8 max-w-6xl">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
