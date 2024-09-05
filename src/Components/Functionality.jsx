import React, { useState } from 'react';
import SignIn from './Login/SignIn';
import Signup from './Login/Signup';

const Functionality = () => {
    const [isSignUp, setIsSignUp] = useState(false);

    const handleOnClick = (type) => {
        setIsSignUp(type === "signUp");
    };

    const containerClass = isSignUp ? "FunctionalContainer rightPenal" : "FunctionalContainer";

    return (
        <>
            <div className={containerClass} id="FunctionalContainer">
                <SignIn />
                <Signup />
                <div className="full-FunctionalContainer">
                    <div className="full">
                        <div className="full-card full-left">
                            <h1>Welcome Back!</h1>
                            <p>To keep connected with us, please log in with your personal info.</p>
                            <button className="ghost" id="signIn" onClick={() => handleOnClick("signIn")}>
                                Sign In
                            </button>
                        </div>
                        <div className="full-card full-right">
                            <h1>Hello, Friend!</h1>
                            <p>Enter your personal details and start your journey with us.</p>
                            <button className="ghost" id="signUp" onClick={() => handleOnClick("signUp")}>
                                Sign Up
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Functionality;
