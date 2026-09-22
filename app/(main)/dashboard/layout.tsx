import DashboardPage from "./page";
import { BarLoader } from "react-spinners";
import { Suspense } from "react";

export default function Layout() {
  return (
    <div className="space-y-6">
      <Suspense
        fallback={
          <div className="mt-4">
            <BarLoader width="100%" color="#8b5cf6" />
          </div>
        }
      >
        <DashboardPage />
      </Suspense>
    </div>
  );
}
