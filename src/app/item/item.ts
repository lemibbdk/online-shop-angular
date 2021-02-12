export interface Item {
  _id: string;
  name: string;
  price: number;
  discount: number;
  category: string;
  subCategory: string;
  properties: [{}];
  shortDescription: string;
  remaining: number;
  available?: boolean;
  reviews?: [{}];
  seller: string;
  countryOrigin: string;
  locatedIn: 'Belgrade' | 'Novi Sad' | 'Nis' | 'Kragujevac' | 'Leskovac' | 'Subotica' | 'Cacak';
  picture?: {};
  totalEvaluation?: number;
  calcPrice: number;
}
