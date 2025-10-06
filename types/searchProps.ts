
export type SortKey = "title" | "startDate";
export type SortOrder = "asc" | "desc";



export type Props = {
  search: string;
  onSearch: (v: string) => void;
  sortKey: SortKey;
  onSortKey: (k: SortKey) => void;
  sortOrder: SortOrder;
  onToggleSortOrder: () => void;
};
