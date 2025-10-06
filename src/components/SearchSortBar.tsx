
export type SortKey = "title" | "startDate";
export type SortOrder = "asc" | "desc";

type Props = {
  search: string;
  onSearch: (v: string) => void;
  sortKey: SortKey;
  onSortKey: (k: SortKey) => void;
  sortOrder: SortOrder;
  onToggleSortOrder: () => void;
};

export default function SearchSortBar({ search, onSearch, sortKey, onSortKey, sortOrder, onToggleSortOrder }: Props) {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:gap-4 mb-4">
      <input
        type="search"
        placeholder="Search trips by title or description..."
        value={search}
        onChange={e => onSearch(e.target.value)}
        className="border p-2 w-full md:w-1/2 mb-2 md:mb-0"
      />

      <div className="flex items-center gap-2">
        <label className="text-sm">Sort by</label>
        <select value={sortKey} onChange={e => onSortKey(e.target.value as SortKey)} className="border p-2">
          <option value="title">Title</option>
          <option value="startDate">Start date</option>
        </select>

        <button
          onClick={onToggleSortOrder}
          className="border p-2 rounded"
          title="Toggle sort order"
        >
          {sortOrder === "asc" ? "Asc" : "Desc"}
        </button>
      </div>
    </div>
  );
}