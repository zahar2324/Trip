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
      await onCreate({ ownerId, title: title.trim(), description: description.trim(), startDate: startDate || undefined, endDate: endDate || undefined });
      setTitle(""); setDescription(""); setStartDate(""); setEndDate("");
    } catch (e) {
      console.error(e);
      setError("Не вдалося створити подорож");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mb-6 border p-4 rounded bg-white">
      <h3 className="font-semibold mb-3">Створити подорож</h3>

      <label className="block text-sm font-medium mb-1">Назва</label>
      <input value={title} onChange={e => setTitle(e.target.value)} className="border p-2 w-full mb-3" placeholder="Назва" />

      <label className="block text-sm font-medium mb-1">Опис</label>
      <input value={description} onChange={e => setDescription(e.target.value)} className="border p-2 w-full mb-3" placeholder="Короткий опис" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
        <div>
          <label className="block text-sm font-medium mb-1">Дата початку</label>
          <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="border p-2 w-full" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Дата завершення</label>
          <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="border p-2 w-full" />
        </div>
      </div>

      {error && <div className="text-red-600 mb-2">{error}</div>}

      <div className="flex items-center gap-3">
        <UiButton onClick={submit} loading={loading} className="bg-indigo-600 text-white">Create Trip</UiButton>
        <button onClick={() => { setTitle(""); setDescription(""); setStartDate(""); setEndDate(""); setError(null); }} className="text-sm text-gray-600">Reset</button>
      </div>
    </section>
  );
}