/* eslint-disable @typescript-eslint/no-explicit-any */

export interface ResponseObj {
  success?: boolean;
  error?: boolean;
  message?: string | any;
  data?: any;
  hide?: boolean;
  status?: string;
}

export interface PaginationInterface {
  page: number | string;
  perPage: number | string;
  search?: string;
}

export interface SortOption {
  label: string;
  value: string; // 'asc' | 'desc' podría ser una alternativa más restrictiva
  by: string;
}

export interface SortGroup {
  label: string;
  items: SortOption[];
}
