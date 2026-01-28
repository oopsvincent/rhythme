import { signOut } from "@/app/actions/auth";
import { SpinnerEmpty } from "@/components/spinner-logout";

export default async function LogoutPage() {
  await signOut();

  return (
    <div className="w-full h-full flex justify-center items-center">
      <SpinnerEmpty />
    </div>
  );
}
