import type { Metadata } from "next";
import "./globals.css";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"

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
        <ResizablePanelGroup direction="vertical" style={{ height: '100vh' }}>
          <ResizablePanel defaultSize={10}>Header</ResizablePanel>
          <ResizablePanel defaultSize={90}>
            <ResizablePanelGroup direction="horizontal" style={{ flex: 1 }}>
              <ResizablePanel defaultSize={20}>sidebar</ResizablePanel>
              <ResizablePanel defaultSize={80}>{children}</ResizablePanel>
            </ResizablePanelGroup>
          </ResizablePanel>
        </ResizablePanelGroup>
      </body>
    </html>
  );
}
