import type { Trip } from "./trips";

export type Props = {
  trips: Trip[];
  currentUserId?: string | null;
  editingId?: string | null;
  onStartEdit: (t: Trip) => void;
  onSave: (id: string, changes: Partial<Pick<Trip, "title" | "description" | "startDate" | "endDate">>) => Promise<void>;
  onCancelEdit: () => void;
  onDelete: (id: string) => Promise<void>;
  onOpen?: (id: string) => void; // <- new optional prop
};
