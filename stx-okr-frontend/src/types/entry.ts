export enum EntryStatus {
  PENDING = 'PENDING',
  SENT = 'SENT',
  ABORTED = 'ABORTED',
}

export interface Entry {
  id: string;
  name: string;
  done: boolean;
  description: string | null;
  startDate: string | null;
  endDate: string | null;
  status: EntryStatus;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
} 