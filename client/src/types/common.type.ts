import { z } from 'zod';

export interface BaseEntity {
  _id: string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface BaseResponse<T> {
  message: string;
  data: T;
}

export interface PaginatedResponse<T> extends BaseResponse<T> {
  pagination: Pagination;
}

export interface Pagination {
  totalCount: number;
  pageSize: number;
  pageNumber: number;
  totalPages: number;
  skip: number;
  limit: number;
}

export interface BaseUser {
  _id: string;
  name: string;
  profilePicture: string | null;
}

export type ZodInfer<T extends z.ZodType> = z.infer<T>;
