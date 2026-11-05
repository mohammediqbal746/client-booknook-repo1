export interface Book {
  _id: string;
  name: string;
  author: string;
  image: string;
  category: string;
  quantity: number;
  rating: number;
  description?: string;
  adderName?: string;
  adderEmail?: string;
}