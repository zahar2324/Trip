import { Link } from "react-router-dom";
import { useAuthStore } from "../store/userStore";
import { LogoutButton } from "../src/components/LogoutButton";
import Header from "../src/components/Header";
export default function Home() {
  const { user } = useAuthStore();

  return (
    <div>
      <Header />

      <main className="p-6 text-center">
        <h2 className="text-2xl font-bold mb-4">Головна сторінка</h2>
        {user ? (
          <p>Ви увійшли як <span className="font-semibold">{user.email}</span></p>
        ) : (
          <p>Тут можна додати опис проєкту, фічі, або просто вітання 👋</p>
        )}
      </main>

      <footer className="bg-gray-100 text-center p-4 mt-10">
        <p>&copy; 2025 Tip IP. Всі права захищені.</p>
      </footer>
    </div>
  );
}
