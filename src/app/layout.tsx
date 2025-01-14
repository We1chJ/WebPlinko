import type { Metadata } from "next";
import "./globals.css";
import {
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Footer from "./components/Footer";
import Script from "next/script";

export const metadata: Metadata = {
  title: "Plinko No Gamble",
  description: "Plinko game but 0-cost version",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <div style={{ width: 0, height: 0, overflow: 'hidden', fontFamily: 'plinko_bold' }}>.</div>
        <Script
          src="https://cdn.jsdelivr.net/npm/phaser@3.60.0/dist/phaser.min.js"
          strategy="afterInteractive"
        />
        <Script
          src="https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js"
          strategy="afterInteractive"
        />
        <ResizablePanelGroup direction="vertical" style={{ height: '100vh' }}>
          <ResizablePanel defaultSize={10}><Header /></ResizablePanel>
          <ResizablePanel defaultSize={85}>
            <ResizablePanelGroup direction="horizontal" style={{ flex: 1 }}>
              <ResizablePanel defaultSize={20}><Sidebar /></ResizablePanel>
              <ResizablePanel defaultSize={80}>{children}</ResizablePanel>
            </ResizablePanelGroup>
          </ResizablePanel>
          <ResizablePanel defaultSize={5}><Footer /></ResizablePanel>
        </ResizablePanelGroup>
      </body>
    </html>
  );
}
