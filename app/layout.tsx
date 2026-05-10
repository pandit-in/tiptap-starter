import { Geist, Geist_Mono } from "next/font/google"
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils"
import Header from "@/components/header"
import { Toaster } from "@/components/ui/sonner"
import { ourFileRouter } from "./api/uploadthing/core";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" })

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "antialiased",
        fontMono.variable,
        "font-sans",
        geist.variable
      )}
    >
      <body>
        <NextSSRPlugin routerConfig={extractRouterConfig(ourFileRouter)} />
        <ThemeProvider>
          <Header />
          <div className="mx-auto mt-24 max-w-4xl p-4">{children}</div>
          <Toaster richColors />
        </ThemeProvider>
      </body>
    </html>
  )
}
