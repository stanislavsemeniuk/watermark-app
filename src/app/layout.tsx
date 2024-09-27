import type { Metadata } from "next";
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
        <LanguageContextProvider>
          <Header />
          {children}
        </LanguageContextProvider>
      </body>
    </html>
  );
}
