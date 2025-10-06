import { Link } from "react-router-dom";
import { useAuthStore } from "../../store/userStore";
import { LogoutButton } from "./LogoutButton";

export default function Header() {
  const { user } = useAuthStore();

  return (
    <header className="bg-gray-800 text-white p-4 flex items-center justify-between">
 
      <div className="w-1/3"></div>

 
      <h1 className="text-xl text-center w-1/3">Trip Planner</h1>

      <div className="flex items-center justify-end w-1/3 space-x-4">
        <Link to="/login">Login</Link>
        <Link to="/register">Register</Link>
        <Link to="/trips">My Trips</Link>
        {user && <LogoutButton />}
      </div>
    </header>
  );
}
