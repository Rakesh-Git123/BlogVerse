import React, { useContext, useState } from 'react';
import "./Login.css";
import { Link } from "react-router-dom";
import { AuthContext } from '../Context/AuthContext';
import { toast } from 'react-toastify';
const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { login } = useContext(AuthContext)
    return (
        <div className='login h-[90vh] flex justify-center items-center'>
            <div className="form-container">
                <p className="title">Login</p>
                <form className="form" onSubmit={(e) => {
                    e.preventDefault();
                    login({ email, password }); 
                }}>

                    <div className="input-group">
                        <label for="email">Username</label>
                        <input type="email" name="email" id="email" placeholder="" onChange={(e) => setEmail(e.target.value)} required />
                    </div>
                    <div className="input-group">
                        <label for="password">Password</label>
                        <input type="password" name="password" id="password" placeholder="" onChange={(e) => setPassword(e.target.value)} required />

                    </div>
                    <button className="sign mt-5 cursor-pointer">Sign in</button>
                </form>
                <div className="social-message">
                    <div className="line"></div>
                    <p className="message">Login with social accounts</p>
                    <div className="line"></div>
                </div>
                <div className="social-icons">
                    <button aria-label="Log in with Google" className="icon cursor-pointer" onClick={()=>toast.info("Coming soon")}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" className="w-5 h-5 fill-current">
                            <path d="M16.318 13.714v5.484h9.078c-0.37 2.354-2.745 6.901-9.078 6.901-5.458 0-9.917-4.521-9.917-10.099s4.458-10.099 9.917-10.099c3.109 0 5.193 1.318 6.38 2.464l4.339-4.182c-2.786-2.599-6.396-4.182-10.719-4.182-8.844 0-16 7.151-16 16s7.156 16 16 16c9.234 0 15.365-6.49 15.365-15.635 0-1.052-0.115-1.854-0.255-2.651z"></path>
                        </svg>
                    </button>
                </div>
                <p className="signup">Don't have an account?
                    <Link to="/signup">Sign up</Link>
                </p>
            </div>
        </div>
    )
}

export default Login