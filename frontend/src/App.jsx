// src/App.jsx
import { Navigate, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/auth/login/LoginPage";
import SignUpPage from "./pages/auth/signup/SignUpPage";
import HomePage from "./pages/home/HomePage";
import AnimalPostPage from "./pages/animal/AnimalPostPage";
import EditAnimalPostPage from "./pages/animal/EditAnimalPostPage";
import ProfilePage from "./pages/profile/ProfilePage";
import Layout from "./layouts/Layout";
import { Toaster } from 'react-hot-toast'
import { useAuthUser } from "./hooks/useAuthUser";
import AnimalDetailPage from "./pages/animal/AnimalDetailPage";
import SavedPostsPage from "./pages/profile/SavedPostsPage";


function App() {
  const { data: authUser } = useAuthUser();

  return (
    <>
      <Routes>
        {/* Layout pages */}
        <Route element={<Layout />}>
          <Route path="/" element={authUser ? <HomePage /> : <Navigate to="/login" />} />
          <Route path="/animal/post" element={<AnimalPostPage />} />
          <Route path="/animal/update/:id" element={<EditAnimalPostPage />} />
          <Route path="/animal/:id" element={<AnimalDetailPage />} />
          <Route path="/profile/:username" element={authUser ? <ProfilePage /> : <Navigate to="/login" /> } />
          <Route path="/profile/saved" element={authUser ? <SavedPostsPage /> : <Navigate to="/login" /> } />
        </Route>

        {/* Auth pages */}
        <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to="/" />} />
        <Route path="/signup" element={!authUser ? <SignUpPage /> : <Navigate to="/" />} />
      </Routes>
      <Toaster />
    </>
  );
}

export default App;
