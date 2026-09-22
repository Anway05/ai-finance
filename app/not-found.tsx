import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
      <h1 className="text-7xl font-extrabold gradient-title mb-4">404</h1>
      <h2 className="text-2xl font-bold text-foreground mb-3">Page Not Found</h2>
      <p className="text-muted-foreground max-w-md mb-8">
        Oops! The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link href="/">
        <Button className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold rounded-xl px-6">
          Return Home
        </Button>
      </Link>
    </div>
  );
}
