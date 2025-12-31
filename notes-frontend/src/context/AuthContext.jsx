import { createContext, useContext, useState, useEffect } from "react";
import api from "../api/axios";
import notesBgImage from "../assets/bg for notes.png";
import loginBgImage from "../assets/bg-for-log.png";


const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isAuth,setIsAuth] = useState(false);
  const [userName, setUserName] = useState("");
  const [loading,setLoading] = useState(true);
  const [loadingBg, setLoadingBg] = useState(loginBgImage);

  useEffect(()=>{
    api.get("/auth/me")
      .then((res) => {
        setIsAuth(true);
        setUserName(res.data.name);
        setLoadingBg(notesBgImage);
      })
      .catch(()=> {
        setIsAuth(false);
        setLoadingBg(loginBgImage);
      })
      .finally(()=> setLoading(false));
  },[]);

  const login = async (email, password) =>{
    await api.post("/auth/login",{email,password});
    // After login, fetch user info to set userName
    const res = await api.get("/auth/me");
    setIsAuth(false); // Reset to trigger notes refetch
    setIsAuth(true);
    setUserName(res.data.name);
  }

  const logout = async ()=>{
    await api.post("/auth/logout");
    setIsAuth(false);
  }

  if(loading) return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        backgroundImage: `url(${loadingBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="bg-white bg-opacity-20 backdrop-blur-md rounded-2xl shadow-2xl p-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
        <p className="text-black text-xl font-semibold">Loading...</p>
      </div>
    </div>
  );

  return (
    <AuthContext.Provider value={{ isAuth, userName, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
