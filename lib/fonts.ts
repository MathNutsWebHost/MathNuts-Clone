import { Bebas_Neue, Inter } from "next/font/google"

export const bebas = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-bebas",
})

export const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
})
