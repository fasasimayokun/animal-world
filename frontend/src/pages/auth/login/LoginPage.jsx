import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

const LoginPage = () => {
  const [ showPassword, setShowPassword] = useState(false);
  const [ formData, setFormData] = useState({
    fullname:"",
    username:"",
    password:"",
    email:""
  });


  handleSubmit = (e) => {
    e.preventDefault();
  };

  handleInputChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
          
          <label className="">
            
            <input
              type="text"
              required
              placeholder="Username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
            />
          </label>

          <label className="">
            
            <input
              type={ showPassword ? "text" : "password"}
              required
              placeholder="Password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
            />
            <button type="button" onClick={() => { setShowPassword(!showPassword)} }>
              { showPassword ? 
                (<EyeOff className="size-5 text-base-content/40" />) : 
                (<Eye className="size-5 text-base-content/40" />)
              }
            </button>
          </label>
    </form>
    </div>
  )
}

export default LoginPage