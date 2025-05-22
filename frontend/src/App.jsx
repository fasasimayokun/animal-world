import { Navigate, Route, Routes } from "react-router-dom"
import LoginPage from "./pages/auth/login/LoginPage"
import SignUpPage from "./pages/auth/signup/SignUpPage"
import HomePage from "./pages/home/HomePage"
import { useQuery } from "@tanstack/react-query"
import AnimalPostPage from "./pages/animal/AnimalPostPage"

function App() {
  const {data:authUser} = useQuery({
    queryKey: ['authUser'],
    queryFn: async () => {
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();
        if(data.error) return null;

        if(!res.ok) {
          throw new Error(data.error || "Something went wrong");
        }
        console.log("The current AuthUser", authUser);
        return data;
      } catch (error) {
          throw new Error(error);
      }
    },
    retry: false,
  });


  return (
    <div className="flex max-w-6xl mx-auto">
      <Routes>
        {/*<Route path='/' element={<HomePage /> } /> */}
        <Route path='/' element={authUser ? <HomePage /> : <Navigate to='/login' />} />
				<Route path='/login' element={!authUser ? <LoginPage /> : <Navigate to='/' />} />
				<Route path='/signup' element={!authUser ? <SignUpPage /> : <Navigate to='/' />} />
        <Route path='/animal/post' element={<AnimalPostPage /> } />
        
      </Routes>
    </div>
  )
}

export default App
