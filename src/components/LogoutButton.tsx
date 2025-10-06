import { useAuthStore } from "../../store/userStore";

export const LogoutButton = () => {
  const { logout, user } = useAuthStore();

  if (!user) return null;

  return (
    <div className="flex items-center gap-2">
      <span className="text-gray-300">{user.email}</span>
      <button
        onClick={logout}
        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
      >
        Logout
      </button>
    </div>
  );
};
