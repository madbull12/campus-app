import "@/styles/globals.css";

import { Inter } from "next/font/google";

import { TRPCReactProvider } from "@/trpc/react";
import { Toaster } from "@/app/_components/ui/sonner";
import Navbar from "@/app/_components/layout/navbar";
import AuthWrapper from "./_components/auth/auth-wrapper";
import { validateRequest } from "@/server/auth";
import { ThemeProvider } from "./_components/theme-provider";
import { EdgeStoreProvider } from "@/lib/edgestore";
import SessionProvider from "./_components/session-provider";
import { Session, User } from "lucia";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata = {
  manifest:"/manifest.json",
  title: "Create T3 App",
  description: "Generated by create-t3-app",
  // icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const sessionData = await validateRequest();

  return (
    <html lang="en">
      <body className={`font-sans ${inter.variable}`}>
        <Toaster
          richColors
          toastOptions={{
            classNames: {
              actionButton: "text-white bg-primary",
            },
          }}
        />
        <TRPCReactProvider>
          <SessionProvider
            value={
              sessionData as {
                user: User;
                session: Session;
              }
            }
          >
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <AuthWrapper user={sessionData.user}>
                <EdgeStoreProvider>
                    <Navbar user={sessionData.user} />

                    {children}
                </EdgeStoreProvider>
              </AuthWrapper>
            </ThemeProvider>
          </SessionProvider>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
