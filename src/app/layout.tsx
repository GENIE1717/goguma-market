import type { Metadata } from "next";
import { Gowun_Dodum, Jua } from "next/font/google";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import "./globals.css";

// 제목용 동글동글 폰트
const jua = Jua({
  variable: "--font-jua",
  weight: "400",
  subsets: ["latin"],
});

// 본문용 폰트
const gowun = Gowun_Dodum({
  variable: "--font-gowun",
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "고구마마켓 🍠 달콤한 동네 거래",
  description: "당근보다 달콤한 우리 동네 중고거래, 고구마마켓",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko" className={`${jua.variable} ${gowun.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col font-sans">
        <Header />
        <main className="flex flex-1 flex-col">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
