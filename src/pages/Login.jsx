import Tamplate from "../components/core/Auth/Tamplate";

import log from '../assets/Images/login.webp'
function Login({ setLogged }) {
  return (
    <>
      <div className='h-100 w-100 flex items-center justify-center '>
        <Tamplate
          title="Welcome Back"
          img={log}
          formType="login"
          des2="My Developer Social Network Platform"
          setLogged={setLogged}
        />
      </div>
    </>

  )
}
export default Login;