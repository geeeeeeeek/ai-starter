// 'use client';
import localFont from "next/font/local";
import "./globals.css";

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import ReduxProvider from "@/redux/redux-provider";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});


export const metadata = {
  title: 'Chat with AI',
  description: 'online chat window Integrated with models like deepseek and gpt-4o, no Login',
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ReduxProvider>
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-blue-100 `}
      >
        <SidebarProvider>
          <AppSidebar />
          <div className="w-full">
            {children}
          </div>
        </SidebarProvider>
      </body>
    </html>
    </ReduxProvider>

  );
}
