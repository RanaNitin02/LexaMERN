import React, { useContext } from 'react'
import { userDataContext } from '../context/UserContext'

const Home = () => {

  const { userData } = useContext(userDataContext)

  return (
    <div className='w-full h-[100vh] bg-gradient-to-t from-[black] '>Home</div>
  )
}

export default Home