import { createClient } from "@/lib/supabase/server";


export default function getSupabaseServer() {
    const supabase = createClient();
    return supabase
}