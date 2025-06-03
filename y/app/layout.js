import { Inter } from "next/font/google";
import "./globals.css";
import SessionProvider from "./components/SessionProvider";
import { NotificationProvider } from "../contexts/NotificationContext";
import { Toaster } from "react-hot-toast"; // ✅ Import the Toaster

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Security Dashboard",
  description: "Security monitoring and Falco rules management",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProvider>
          <NotificationProvider>
            {children}
            <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
          </NotificationProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
