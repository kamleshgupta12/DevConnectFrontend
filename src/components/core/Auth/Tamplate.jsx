import SignupForm from "./SignupForm";
import LoginForm from "./LoginForm";
import GithubAuth from '../Auth/omniAuth/GithubAuth'
import GoogleAuth from "./omniAuth/GoogleAuth";



function Tamplate({ title, des1, des2, img, formType, setLogged }) {
    return ( 
        <>
            <div className="p-10  w-full flex  justify-center items-center sm:flex-col md:flex-row m-auto rounded-3xl gap-4   ">
                <div className=" w-[300px] border border-richblack-600 flex flex-col gap-3 rounded-md  bg-richblack-800   shadow-md p-3 ">
                    <div>
                        <h1 className="text-[25px] text-center font-bold text-[#308d46]">{title}</h1>
                    </div>
                    <div className="flex flex-col">
                        <div className="text-[#000000] text-[18px]">{des1}</div>
                        <div className="text-richblack-100 text-center text-[15px] ">{des2}</div>
                    </div>
                    <div>
                        {
                            formType === "signup"
                                ? (<SignupForm setLogged={setLogged} />)
                                : (<LoginForm setLogged={setLogged} />)
                        }
                    </div>
                    <div className="flex justify-center items-center">
                        <div className="w-[150px] h-[1px] bg-richblack-400"></div>
                        <span className="mx-1 font-mono text-richblack-400">OR</span>
                        <div className="w-[150px] h-[1px] bg-richblack-400"></div>
                    </div>
                    <div className="flex justify-center items-center flex-col gap-2 ">
                       <GithubAuth/>
                       <GoogleAuth/>
                    </div>
                </div>
            </div>
        </>
    )
}
export default Tamplate;