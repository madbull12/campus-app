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
import { Metadata } from "next";
import AdminPanelLayout from "./_components/layout/home-layout";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  metadataBase: new URL("http://localhost:3000/"),
  title: "Campus App",
  description: "This is the campus app",
  category: "website",
  generator: "Next.js", // framework used

  // the big is here
  manifest: "./manifest.webmanifest",
};
export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await validateRequest();

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
              user  as User
            }
          >
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <AuthWrapper user={user as User}>
                <EdgeStoreProvider>
                  <AdminPanelLayout>
                    <Navbar user={user as User} />

                    {children}
                  </AdminPanelLayout>
                </EdgeStoreProvider>
              </AuthWrapper>
            </ThemeProvider>
          </SessionProvider>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
