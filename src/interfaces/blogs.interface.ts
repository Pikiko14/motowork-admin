export interface BlogsInterface {
  _id?: string;
  title: string;
  description: string;
  category: string;
  subcategory?: string;
  more_details: string;
  images?: BlogsImagesInterface[];
  img_default?: string;
  createdAt?: any;
}

export interface BlogsImagesInterface {
  path: string;
  _id?: string;
}
