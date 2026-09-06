import type { Metadata } from "next";
import { Bungee, Figtree, Special_Elite } from "next/font/google";
import "./globals.css";

const bungee = Bungee({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bungee",
});

const figtree = Figtree({
  subsets: ["latin"],
  variable: "--font-figtree",
});

const specialElite = Special_Elite({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-special-elite",
});

export const metadata: Metadata = {
  title: "BurgerMasters — Sofia grill counter",
  description:
    "Black Angus burgers, fries, and fountain drinks. Original BurgerMasters menu rebuilt for the web.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${bungee.variable} ${figtree.variable} ${specialElite.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
