export type Trip = {
  id: string;
  title: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  ownerId: string;
  collaborators: string[];
};