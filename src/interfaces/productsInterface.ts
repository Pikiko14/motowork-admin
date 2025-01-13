import { BannerImageInterface } from "./bannersInterface";

export interface AdditionalField {
    name: string;
    value: string;
  }
  
  export interface SubsectionInterface {
    name: string;
    value: string;
  }
  
  export interface AdditionalInfoInterface {
    sectionName: string;
    enable: boolean;
    subsections: SubsectionInterface[];
  }
  
  export interface DetailsProducts {
    power: string;
    weight: string;
    max_power: string;
    torque: string;
    type_engine: string;
    colors: string[];
  }
  
  export interface ProductsInterface {
    _id?: string;
    name: string;
    model: string;
    state: "Nueva" | "Usada";
    brand: string;
    price: number | null;
    discount?: number | null;
    sku?: string;
    enableDiscount?: boolean;
    category: string;
    description: string;
    banner: ProductsBanners[];
    images: ProductImagesInterface[];
    type: string;
    details: DetailsProducts;
    additionalInfo?: AdditionalInfoInterface[];
    createdAt?: Date;
    brand_icon?: string
    image_default?: string;
    active?: boolean;
  }

  export interface ProductsBanners {
    path: string;
    type_banner: BannerType;
  }
  
  export interface ProductImagesInterface {
    path: string;
    type: BannerType;
    _id?: string;
  }

  export enum BannerType {
    mobile = "mobile",
    desktop = "desktop",
  }
  
  