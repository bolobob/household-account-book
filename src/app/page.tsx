import { AuthGuard } from "@/components/auth/AuthGuard";
import { HouseholdApp } from "@/components/HouseholdApp";

export default function Home() {
  return (
    <AuthGuard>
      <HouseholdApp />
    </AuthGuard>
  );
}
