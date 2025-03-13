import { useQuery } from '@tanstack/react-query';
import { api } from '../api/client';
import { Entry, PaginatedResponse } from '../types/entry';

interface UseEntriesParams {
  page: number;
  pageSize: number;
}

export const useEntries = ({ page, pageSize }: UseEntriesParams) => {
  return useQuery({
    queryKey: ['entries', page, pageSize],
    queryFn: async () => {
      const { data } = await api.get<PaginatedResponse<Entry>>(
        `/entries?page=${page}&limit=${pageSize}`
      );
      return data;
    },
    staleTime: 30000,
  });
}; 