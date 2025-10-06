import { useAuthStore } from "../store/userStore";
import Header from "../src/components/Header";
import { Link } from "react-router-dom";
import { FaMapMarkedAlt, FaUsers, FaMobileAlt } from "react-icons/fa";

export default function Home() {
  const { user } = useAuthStore();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <div className="relative bg-indigo-600 text-white">
          <img
            src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1400&q=80"
            alt="Travel banner"
            className="w-full h-64 object-cover opacity-70"
          />
          <div className="absolute inset-0 flex flex-col justify-center items-center">
            <h2 className="text-4xl font-bold mb-2">Вирушай у пригоди!</h2>
            <p className="text-lg mb-4">
              Плануйте, діліться та насолоджуйтесь кожною подорожжю разом з Trip Planner
            </p>
            {!user && (
              <Link
                to="/register"
                className="bg-yellow-400 text-indigo-800 font-semibold px-6 py-3 rounded-lg shadow-lg hover:bg-yellow-300 transition"
              >
                Почати зараз
              </Link>
            )}
          </div>
        </div>

        <section className="p-6 text-center">
          <h3 className="text-3xl font-bold mb-6">Чому обирають нас?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition flex flex-col items-center">
              <FaMapMarkedAlt className="text-indigo-600 text-5xl mb-4" />
              <h4 className="font-semibold text-xl mb-2">Маршрути на будь-який смак</h4>
              <p>Створюйте власні маршрути та знаходьте цікаві місця по всьому світу.</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition flex flex-col items-center">
              <FaUsers className="text-indigo-600 text-5xl mb-4" />
              <h4 className="font-semibold text-xl mb-2">Спільна робота</h4>
              <p>Запрошуйте друзів та плануйте подорожі разом у зручному інтерфейсі.</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition flex flex-col items-center">
              <FaMobileAlt className="text-indigo-600 text-5xl mb-4" />
              <h4 className="font-semibold text-xl mb-2">Доступ з будь-якого пристрою</h4>
              <p>Мобільний або десктоп — ваші плани завжди під рукою.</p>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-gray-100 text-center p-4 mt-10">
        <p>&copy; 2025 Trip Planner. Всі права захищені.</p>
      </footer>
    </div>
  );
}
