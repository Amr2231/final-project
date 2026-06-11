import Provider from "@/components/providers/shared";
import { AuthVisual } from "@/features/auth";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-row">
      <div className="flex flex-col justify-center w-full lg:w-1/2 px-8 sm:px-16 xl:px-32 py-12  shrink-0">
        <Provider>{children}</Provider>
      </div>
      <AuthVisual />
    </div>
  );
}
