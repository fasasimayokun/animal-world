import { Eye, EyeOff, Lock, MessageSquare, User } from "lucide-react";
import { useState } from "react";
import AuthImagePattern from "../../../components/AuthImagePattern";
import { Link } from "react-router-dom";

const LoginPage = () => {
  const [ showPassword, setShowPassword] = useState(false);
  const [ formData, setFormData] = useState({
    username:"",
    password:"",
  });


  const handleSubmit = (e) => {
    e.preventDefault();
  };

  const handleInputChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="flex flex-col justify-center items-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center mb-8">
              <div className="flex flex-col items-center gap-2 group">
                <div className="size-12 rounder-xl bg-primary/10 flex items-center justify-center
                  group-hover:bg-primary/20 transition-colors">
                  <MessageSquare className="size-6 text-primary" />
                </div>
                <h1 className="text-2xl font-bold mt-2">Welcome Back</h1>
                <p className="text-base-content/60">Sign in your account</p>
              </div>
          </div>

          <form onSubmit={handleSubmit} className="mb-0">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Username</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="size-5 text-base-content/40" />
                  </div>
                  <input
                    type="text"
                    className={`w-full border border-gray-300 rounded-md px-4 py-2 pl-10`}
                    placeholder="johndoe"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                />
                </div>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Password</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="size-5 text-base-content/40" />
                  </div>
                  <input
                    type={ showPassword ? "text" : "password"}
                    className={`w-full border border-gray-300 rounded-md px-4 py-2 pl-10`}
                    placeholder="********"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                  />
                  <button type="button" className="absolute inset-y-0 right-0 pr-3 flex items-center" 
                  onClick={() => { setShowPassword(!showPassword)}}>
                    { showPassword ? 
                      ( <EyeOff className="size-5 text-base-content/40" /> ) : 
                      ( <Eye className="size-5 text-base-content/40" /> )
                    }
                  </button>
                </div>
              </div>
              
              <button type="submit" className="btn btn-primary w-full mt-2">Create Account</button>
          </form>
          <div className="text-center mt-2">
              <p className="text-base-content/60">
                Don&apos;t have an account?
                <Link to="/signup" className="link link-primary">
                  Create Account
                </Link>
              </p>
          </div>
        </div>
      </div>

      {/* right side */}

      <AuthImagePattern
        title="Good to have you back"
        subtitle="Welcome back to learn more about your favourite animals."
      />
    </div>
  )
}

export default LoginPage