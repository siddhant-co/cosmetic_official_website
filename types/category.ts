import { Product } from "./product";

export interface Category {
  description: string;
  products: Product[];
  id: number;
  sequence_number: number;
  name: string;
  createdAt: string;
  isDeleted: boolean;
  banner: string;
  imageUrl: string;
  publicId: string;
}