import React from 'react'

// Auth gating is handled by middleware (lib/supabase/proxy.ts).
// No need to call getUser() here — middleware already redirects
// unauthenticated users to /login?redirect=/user.
const layout = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <main>{children}</main>
  )
}

export default layout