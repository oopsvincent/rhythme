import { SpinnerEmpty } from '@/components/spinner-logout'

const loading = () => {
  return (
       <div className="w-full h-full flex justify-center items-center">
         <SpinnerEmpty />
       </div>
  )
}

export default loading