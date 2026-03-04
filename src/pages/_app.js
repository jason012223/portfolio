import "@/styles/globals.css";
import { Bowlby_One_SC } from "next/font/google";

const displayFont = Bowlby_One_SC({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-display",
  display: "swap",
});

export default function App({ Component, pageProps }) {
  return (
    <div className={displayFont.variable}>
      <Component {...pageProps} />
    </div>
  );
}
