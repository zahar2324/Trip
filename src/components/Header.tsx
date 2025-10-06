import { Link } from "react-router-dom";
import { useAuthStore } from "../../store/userStore";
import { LogoutButton } from "./LogoutButton";

export default function Header() {
  const { user } = useAuthStore();

  return (
    <header className="bg-indigo-600 text-white shadow-md p-4 flex items-center justify-between">
  
      <Link to="/" className="flex items-center space-x-2">
        <div className="bg-white text-indigo-600 font-bold rounded-full w-10 h-10 flex items-center justify-center shadow-md">
          TP
        </div>
        <span className="text-2xl font-semibold">Trip Planner</span>
      </Link>

      <nav className="flex items-center space-x-4">
        {!user && (
          <>
            <Link to="/login" className="hover:bg-indigo-500 px-3 py-1 rounded transition">
              Login
            </Link>
            <Link to="/register" className="hover:bg-indigo-500 px-3 py-1 rounded transition">
              Register
            </Link>
          </>
        )}
        {user && (
          <>
            <Link to="/trips" className="hover:bg-indigo-500 px-3 py-1 rounded transition">
              My Trips
            </Link>
            <LogoutButton />
          </>
        )}
      </nav>
    </header>
  );
}
