import type { Metadata } from "next";
import { Chela_One, Cuprum, Kelly_Slab, Lobster } from "next/font/google";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { getAdminSession } from "@/lib/auth";
import "./globals.css";

const cuprum = Cuprum({
  subsets: ["latin"],
  weight: ["500", "700"],
  style: ["normal", "italic"],
  variable: "--font-cuprum",
});

const lobster = Lobster({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-lobster",
});

const chela = Chela_One({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-chela",
});

const kelly = Kelly_Slab({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-kelly",
});

export const metadata: Metadata = {
  title: "BurgerMasters",
  description:
    "BurgerMasters grill — burgers, fries, and drinks from the original shop.",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const session = await getAdminSession();

  return (
    <html
      lang="en"
      className={`${cuprum.variable} ${lobster.variable} ${chela.variable} ${kelly.variable}`}
    >
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css"
        />
      </head>
      <body>
        <Header adminName={session?.username} />
        <div className="bm-container">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
