export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: {
    code: string;
    message: string;
  };
  meta?: {
    page: number;
    perPage: number;
    total: number;
  };
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: "admin" | "manager" | "rep";
  tenantId: string;
}
