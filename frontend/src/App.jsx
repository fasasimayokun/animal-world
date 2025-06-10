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
import { useThemeStore } from "./hooks/useThemeStore";
import { SettingPage } from "./pages/settings/SettingPage";
import LandingPage from "./pages/home/LandingPage";
import LoadingSpinner from "./components/common/LoadingSpinner";


function App() {
  const { data: authUser, isLoading } = useAuthUser(); // add isLoading
  const { theme } = useThemeStore();

  if (isLoading) {
		return (
			<div className='h-screen flex justify-center items-center'>
				<LoadingSpinner size='lg' />
			</div>
		);
	}

  return (
    <div data-theme={theme}>
      <Routes>
        {/* Layout pages */}
        <Route element={<Layout />}>
          <Route path="/animals" element={authUser ? <HomePage /> : <Navigate to="/login" />} />
          <Route path="/animal/post" element={authUser ? <AnimalPostPage /> : <Navigate to="/login" />} />
          <Route path="/animal/update/:id" element={authUser ? <EditAnimalPostPage /> : <Navigate to="/login" />} />
          <Route path="/animal/:id" element={authUser ? <AnimalDetailPage /> : <Navigate to="/login" />} />
          <Route path="/settings" element={authUser ? <SettingPage /> : <Navigate to="/login" />} />
          <Route path="/profile/:username" element={authUser ? <ProfilePage /> : <Navigate to="/login" />} />
          <Route path="/profile/saved" element={authUser ? <SavedPostsPage /> : <Navigate to="/login" />} />
        </Route>

        {/* Auth pages */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to="/animals" />} />
        <Route path="/signup" element={!authUser ? <SignUpPage /> : <Navigate to="/animals" />} />
      </Routes>
      <Toaster />
    </div>
  );
}

export default App;
