import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <>
      <h1>Dashboard</h1>
      {user ? <p>{user.email}</p> : <p>Not logged in</p>}
    </>
  );
}
