import { createClient } from "@/utils/supabase/server";
import NavbarClient from "./navbar-client";

/**
 * Server Component that fetches user authentication state
 * and passes it to the client component for rendering
 */
const Navbar = async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  console.log("Navbar user:", user); // Debug log

  return <NavbarClient user={user} />;
};

export default Navbar;