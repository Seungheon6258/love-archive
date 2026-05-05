import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "우리의 500일 💕",
  description: "소중한 우리의 기억을 담은 사랑 기록 앱",
  keywords: ["500일", "기념일", "사랑", "추억"],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#FFB6C1",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body style={{ background: "var(--bg)" }}>
        <div className="app-container">
          {children}
        </div>
      </body>
    </html>
  );
}
