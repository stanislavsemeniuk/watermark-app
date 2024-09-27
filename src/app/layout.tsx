import type { Metadata } from "next";
import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter';

import Header from "./components/Header";
import LanguageContextProvider from "./context/LanguageContext";

export const metadata: Metadata = {
  title: "Watermark creation",
  description: "Add watermark to your images",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body style={{margin:'0',padding:'0'}}>
        <AppRouterCacheProvider>
          <LanguageContextProvider>
            <Header />
            {children}
          </LanguageContextProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
