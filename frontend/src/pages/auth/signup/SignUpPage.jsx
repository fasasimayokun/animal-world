import { useState } from "react";
import { MessageSquare, User, Mail, Lock, EyeOff, Eye, Loader2, User2, MailIcon } from "lucide-react";
import { Link } from "react-router-dom";
import AuthImagePattern from "../../../components/AuthImagePattern";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const SignUpPage = () => {
  const [ showPassword, setShowPassword] = useState(false);
  const [ formData, setFormData] = useState({
    fullname:"",
    username:"",
    password:"",
    email:""
  });

  const queryClient = useQueryClient();

  const {mutate:signup, isPending, isError, error} = useMutation({
    mutationFn: async ({ fullname, username, password, email}) => {
      try {
        const res = await fetch("/api/auth/signup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ fullname, username, password, email}),
        });

        const data = res.json();
        if(!res.ok) {
          throw new Error(data.error || "Failed to create Account");
        }
        console.log(data);
        return data;
      } catch (error) {
        console.error(error);
        throw new Error(error);
      }
    },
    onSuccess: () => {
      toast.success("Account created successfully");
      queryClient.invalidateQueries({queryKey: ['authUser']});
    }
  });


  const handleSubmit = (e) => {
    e.preventDefault();
    signup(formData);
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
                <h1 className="text-2xl font-bold mt-2">Create Account</h1>
                <p className="text-base-content/60">Get started with your free account</p>
              </div>
          </div>

          <form onSubmit={handleSubmit} className="mb-0">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">FullName</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="size-5 text-base-content/40" />
                  </div>
                  <input
                    type="text"
                    className={`w-full border border-gray-300 rounded-md px-4 py-2 pl-10`}
                    placeholder="John Doe"
                    name="fullname"
                    value={formData.fullname}
                    onChange={handleInputChange}
                />
                </div>
              </div>

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
                  <span className="label-text font-medium">Email</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="size-5 text-base-content/40" />
                  </div>
                  <input
                    type="email"
                    className={`w-full border border-gray-300 rounded-md px-4 py-2 pl-10`}
                    placeholder="you@gmail.com"
                    name="email"
                    value={formData.email}
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
              
              <button type="submit" className="btn btn-primary w-full mt-2">
                { isPending ? "Loading..." : "Create Account" }
              </button>
              {isError && <p className='text-red-500'>{error.message}</p>}
          </form>
          <div className="text-center mt-2">
              <p className="text-base-content/60">
                Already have an account?
                <Link to="/login" className="link link-primary">
                  Sign in
                </Link>
              </p>
          </div>
        </div>
      </div>

      {/* right side */}

      <AuthImagePattern
        title="Join our community"
        subtitle="Learn more about your favourite animal, and share your facts with friends."
      />
    </div>
  )
}

export default SignUpPage