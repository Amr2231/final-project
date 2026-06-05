import { Toaster } from "@/components/ui/sonner";
import NextAuthProvider from "./components/next-auth.provider";
import ReactQueryProvider from "./components/react-query.provider";
import ThemeProvider from "../theme-provider";

export default function Provider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ReactQueryProvider>
      <NextAuthProvider>
        <ThemeProvider>
          <Toaster position="top-right" />
          {children}
        </ThemeProvider>
      </NextAuthProvider>
    </ReactQueryProvider>
  );
}
