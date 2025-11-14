// Server component wrapper
"use server";

import { createClient } from "@/utils/supabase/client";
import NavbarClient from "./navbar-client";

const Navbar = async () => {

  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();


  return <NavbarClient user={user} />;
};

export default Navbar;