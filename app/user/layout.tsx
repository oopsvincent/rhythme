import React from 'react'
import { getUser } from '../actions/auth';
import { redirect } from 'next/navigation';

const layout = async ({
  children,
}: {
  children: React.ReactNode;
}) => {

    const user = await getUser();
    if (!user) {
    // Redirect to login with the return URL
    redirect("/login?redirect=/user")
  }
    // redirect(`/user/${user?.id}`)

  return (
    <main>{children}</main>
  )
}

export default layout