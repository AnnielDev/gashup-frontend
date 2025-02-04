export interface IUser {
  _id?: string;
  code: string;
  name: string;
  email: string;
  phone: string;
  banner?: string | null | Blob | File;
  password?: string;
  img?: Blob | string | null;
  isActive?: boolean;
  isDeleted?: boolean;
  followed?: string[];
  followers?: string[];
  role?: string;
  created_at?: string;
  updated_at?: string;
}
