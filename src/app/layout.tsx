import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import { AuthProvider } from "@/providers/AuthProvider";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AI-Trader",
  description: "AI 기반 주식 거래 플랫폼",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={inter.className}>
        <Providers>
          <AuthProvider>
            <div className="flex">
              <Sidebar />
              <div className="flex-1 ml-64">
                <Header />
                <main className="min-h-screen bg-gray-50">
                  {children}
                </main>
              </div>
            </div>
          </AuthProvider>
        </Providers>
      </body>
    </html>
  );
} 