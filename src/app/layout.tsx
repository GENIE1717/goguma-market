import type { Metadata, Viewport } from "next";
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

// 휴대폰에서 열면 화면 폭에 맞추고, 아이폰 아래쪽 홈 막대 영역까지 쓴다
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#fff9ee",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko" className={`${jua.variable} ${gowun.variable} h-full antialiased`}>
      {/* 휴대폰에서는 아래쪽 탭 메뉴(약 64px) 만큼 띄워 둔다 */}
      <body className="flex min-h-full flex-col pb-[calc(4rem+env(safe-area-inset-bottom))] font-sans md:pb-0">
        <Header />
        <main className="flex flex-1 flex-col">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
