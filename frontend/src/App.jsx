import { useContext } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Customize from './pages/Customize'
import { userDataContext } from './context/UserContext'
import Customize2 from './pages/Customize2'


const App = () => {

  const { userData, setUserData } = useContext(userDataContext);

  return (
    <Routes>
      <Route path='/' element={ (userData?.assistantName && userData?.assistantImage) ? <Home /> : <Navigate to={"/customize"}/> } />
      <Route path='/login' element={ !userData ? <Login /> : <Navigate to={"/customize"} />} />
      <Route path='/signup' element={ !userData ? <Signup /> : <Navigate to={"/customize"} />} />
      <Route path='/customize' element={ userData ? <Customize /> : <Navigate to={"/signup"} />} />
      <Route path='/customize2' element={ userData ? <Customize2 /> : <Navigate to={"/signup"} />} />
    </Routes>
  )
}

export default App