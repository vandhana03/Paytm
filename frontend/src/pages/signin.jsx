import { BottomWarning } from "../components/bottomwarning"
import Button from "../components/button"
import { Heading } from "../components/heading"
import { InputBox } from "../components/inputbox"
import { SubHeading } from "../components/subheading"
import axios from "axios";
import { useNavigate } from "react-router-dom"
import { useState } from "react";


function Signin(){
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    return <div className="bg-slate-300 flex justify-center h-screen">
    <div className="flex flex-col justify-center">
          <div className="rounded-lg bg-white w-80 text-center p-2 h-max px-4">
    <Heading label={"Sign In"} />
    <SubHeading label={"Sign in to your account"} />
    <InputBox label={"Email"} placeholder={"Enter your email"} onChange={(e) => setEmail(e.target.value)} />
    <InputBox label={"Password"} placeholder={"Enter your password"} onChange={(e) => setPassword(e.target.value)} />
    <div className="pt-4">
        <Button onClick={async () => {
                    const response = await axios.post("https://paytm-y8gl.onrender.com/api/v1/user/signin", {
                      username:email,
                      password
                    });
                    localStorage.setItem("token", response.data.token)
                    navigate("/dashboard")
                    
                  }} label={"Sign in"} />
    </div>
        <BottomWarning label={"Don't have an account?"} buttonText={"Sign Up"} to="/signup" />

</div>
</div>
</div>
}
export default Signin;