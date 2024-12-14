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
    licenseType: string;
    storage: string;
    testDrive: string;
    colors: string[];
  }
  
  export interface ProductsInterface {
    name: string;
    model: string;
    state: "Nueva" | "Usada";
    brand: string;
    price: number | null;
    discount?: number | null;
    enableDiscount?: boolean;
    category: string;
    description: string;
    banner: string;
    images: string[];
    type: string;
    details: DetailsProducts;
    additionalInfo?: AdditionalInfoInterface[];
    createdAt?: Date;
    brand_icon?: string
    image_default?: string;
  }
  