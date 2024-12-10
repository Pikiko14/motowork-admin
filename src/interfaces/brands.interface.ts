export interface BrandsInterface {
    _id?: string;
    name: string;
    icon: string;
    is_active?: boolean;
    type: Typebrand;
    count_news?: number;
    count_used?: number;
  }
  
  export enum Typebrand {
    vehicle = "vehicle",
    product = "product",
  }
  