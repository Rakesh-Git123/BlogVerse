import React, { useContext, useState } from 'react';
import "./Signup.css";
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AuthContext } from '../Context/AuthContext';

const Signup = () => {
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const {signup}=useContext(AuthContext);
    

    return (
        <div className='signup h-[90vh] flex justify-center items-center'>
            <div className="form-container">
                <p className="title">Sign Up</p>
                <form className="form" onSubmit={(e)=>{
                    e.preventDefault();
                    signup({ fullName, email, password })
                }}>
                    <div className="input-group">
                        <label htmlFor="name">Username</label>
                        <input 
                            type="text" 
                            name="name" 
                            id="name" 
                            required 
                            onChange={(e) => setFullName(e.target.value)} 
                        />
                    </div>
                    <div className="input-group">
                        <label htmlFor="email">Email</label>
                        <input 
                            type="email" 
                            name="email" 
                            id="email" 
                            required 
                            onChange={(e) => setEmail(e.target.value)} 
                        />
                    </div>
                    <div className="input-group">
                        <label htmlFor="password">Password</label>
                        <input 
                            type="password" 
                            name="password" 
                            id="password" 
                            required 
                            onChange={(e) => setPassword(e.target.value)} 
                        />
                    </div>
                    <button className="sign mt-5 cursor-pointer" type="submit">Sign Up</button>
                </form>
                
                <p className="signup mt-3">Already have an account?  
                    <Link to="/login"> Login</Link>
                </p>
            </div>
        </div>
    );
}

export default Signup;
