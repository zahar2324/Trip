import React from "react";
import UiButton from "./UiButton";
import type { Props } from "../../types/tripForm";

export default function TripForm({ ownerId, onCreate }: Props) {
  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [startDate, setStartDate] = React.useState("");
  const [endDate, setEndDate] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  const submit = async () => {
    setError(null);
    if (!title.trim()) return setError("Введіть назву подорожі.");
    if (startDate && endDate && startDate > endDate) return setError("Дата початку повинна бути раніше дати завершення.");
    try {
      setLoading(true);
      await onCreate({
        ownerId,
        title: title.trim(),
        description: description.trim(),
        startDate: startDate || undefined,
        endDate: endDate || undefined,
      });
      setTitle(""); setDescription(""); setStartDate(""); setEndDate("");
    } catch (e) {
      console.error(e);
      setError("Не вдалося створити подорож");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setTitle(""); setDescription(""); setStartDate(""); setEndDate(""); setError(null);
  };

  return (
    <section className="mb-6 border rounded-lg p-6 bg-white shadow-md hover:shadow-lg transition">
      <h3 className="font-semibold text-xl mb-4 text-indigo-700">Створити подорож</h3>

      <div className="mb-3">
        <label className="block text-sm font-medium mb-1">Назва</label>
        <input
          value={title}
          onChange={e => setTitle(e.target.value)}
          className="border rounded-md p-2 w-full focus:ring-2 focus:ring-indigo-400 focus:outline-none"
          placeholder="Назва"
        />
      </div>

      <div className="mb-3">
        <label className="block text-sm font-medium mb-1">Опис</label>
        <input
          value={description}
          onChange={e => setDescription(e.target.value)}
          className="border rounded-md p-2 w-full focus:ring-2 focus:ring-indigo-400 focus:outline-none"
          placeholder="Короткий опис"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
        <div>
          <label className="block text-sm font-medium mb-1">Дата початку</label>
          <input
            type="date"
            value={startDate}
            onChange={e => setStartDate(e.target.value)}
            className="border rounded-md p-2 w-full focus:ring-2 focus:ring-indigo-400 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Дата завершення</label>
          <input
            type="date"
            value={endDate}
            onChange={e => setEndDate(e.target.value)}
            className="border rounded-md p-2 w-full focus:ring-2 focus:ring-indigo-400 focus:outline-none"
          />
        </div>
      </div>

      {error && <div className="text-red-600 mb-3 font-medium">{error}</div>}

      <div className="flex flex-wrap items-center gap-3">
        <UiButton
          onClick={submit}
          loading={loading}
          className="bg-indigo-600 text-white hover:bg-indigo-500 transition rounded-md px-5 py-2"
        >
          Створити
        </UiButton>
        <button
          onClick={resetForm}
          className="text-indigo-600 hover:text-indigo-500 border border-indigo-600 rounded-md px-4 py-2 transition"
        >
          Очистити
        </button>
      </div>
    </section>
  );
}
