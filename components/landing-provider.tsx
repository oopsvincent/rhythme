import React from "react";
import { createClient } from "@/utils/supabase/server";
import Navbar from "./landing/navbar";
import RhythmeLanding from "./landing/landing-page";

/**
 * Server Component wrapper that fetches user data and renders both
 * the async Navbar and the client-side landing page content
 */
const LandingPageWrapper = async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <>
      <Navbar />
      <RhythmeLanding user={user} />
    </>
  );
};

export default LandingPageWrapper;