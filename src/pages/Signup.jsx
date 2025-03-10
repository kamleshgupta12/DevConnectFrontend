import Tamplate from "../components/core/Auth/Tamplate";

import sign from '../assets/Images/signup.webp'
function Signup({setLogged}){
    return(<>
    <Tamplate
    title="Welcome to DevConnect"
    img={sign}
    formType="signup"
    des2='The Ultimate Social Network for Developers'
    setLogged={setLogged}
    />
    </>
    )
}
export default Signup;