import { createContext, useContext, useState, useEffect } from "react";
import api from "../api/axios";


const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isAuth,setIsAuth] = useState(false);
  const [loading,setLoading] = useState(true);

  useEffect(()=>{
    api.get("/auth/me")
      .then(()=> setIsAuth(true))
      .catch(()=> setIsAuth(false))
      .finally(()=> setLoading(false));
  },[]);

  const login = async (email, password) =>{
    await api.post("/auth/login",{email,password});
    setIsAuth(true);
  }

  const logout = async ()=>{
    await api.post("/auth/logout");
    setIsAuth(false);
  }

  if(loading) return<p>loading...</p>;

  return (
    <AuthContext.Provider value={{ isAuth,login,logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
