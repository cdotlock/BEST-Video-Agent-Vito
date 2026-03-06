import type { Metadata } from "next";
import AntdProvider from "./components/AntdProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Agent Forge",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">
        <AntdProvider>{children}</AntdProvider>
      </body>
    </html>
  );
}
