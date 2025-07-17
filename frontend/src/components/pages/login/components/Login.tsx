import React, { useState } from 'react';
import AnimatedBackground from './AnimatedBackground';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';
interface LoginProps {
  onLogin: (user: any) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [isSignUp, setIsSignUp] = useState(false);

  const handleLoginSuccess = (user: any) => {
    onLogin(user);
  };

  const handleSignupSuccess = (user: any) => {
    onLogin(user);
  };

  const switchToSignUp = () => {
    setIsSignUp(true);
  };

  const switchToLogin = () => {
    setIsSignUp(false);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Left Side - Animated Background */}
      <AnimatedBackground />

      {/* Right Side - Sliding Forms Container */}
      <div className="w-1/2 bg-white relative overflow-hidden">
        {/* Sliding Container */}
        <div 
          className={`absolute inset-0 flex transition-transform duration-500 ease-in-out ${
            isSignUp ? '-translate-x-1/2' : 'translate-x-0'
          }`}
          style={{ width: '200%' }}
        >
          {/* Login Form */}
          <LoginForm 
            onLoginSuccess={handleLoginSuccess} 
            onSwitchToSignUp={switchToSignUp} 
          />

          {/* Sign Up Form */}
          <SignupForm 
            onSignupSuccess={handleSignupSuccess} 
            onSwitchToLogin={switchToLogin} 
          />
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-4 right-4 text-gray-400 text-sm">
        Secure login powered by CollabEvent
      </div>
    </div>
  );
};

export default Login;