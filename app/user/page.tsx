import * as React from 'react'
import { getUser } from '../actions/auth'
import { redirect } from 'next/navigation';

const page = async () => {
    const user = await getUser();
    redirect(`/user/${user?.id}`);
  return (
    <div>user</div>
  )
}

export default page