import "./globals.css";
import { Bangers } from "next/font/google";

const bangers = Bangers({
  subsets: ["latin"], // Specify the subset
  weight: "400", // Correct usage of `weight`
});

// Components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${bangers.className}`}>
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
