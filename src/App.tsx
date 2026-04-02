import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import { useUserData } from "./context/UserContext";
import Loading from "./components/Loading";
import Register from "./pages/Register";
import Album from "./pages/Album";
import PlayList from "./pages/PlayList";
import Admin from "./pages/Admin";

const App = () => {
  const { user, isAuth, loading } = useUserData();
  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/album/:id" element={<Album />} />
            <Route
              path="/playlist"
              element={isAuth ? <PlayList /> : <Navigate to="/" />}
            />
            <Route
              path="/admin/dashboard"
              element={
                isAuth && user?.role === "admin" ? (
                  <Admin />
                ) : (
                  <Navigate to="/" />
                )
              }
            />
            <Route
              path="/login"
              element={isAuth ? <Navigate to="/" replace /> : <Login />}
            />
            <Route
              path="/register"
              element={isAuth ? <Navigate to="/" replace /> : <Register />}
            />
          </Routes>
        </BrowserRouter>
      )}
    </>
  );
};

export default App;
