export enum TypeBanner {
  home = "home",
  news = "news",
  used = "used",
  experencie = "experience",
  us = "us",
  accesories = "accesories",
  vehicles = "vehicles",
}

export enum TypeImageBanner {
  desktop = "desktop",
  tablet = "tablet",
  mobile = "mobile",
}

export interface BannerImageInterface {
  _id?: string;
  path: string;
  type: TypeImageBanner;
}

export interface BannersInterface {
  _id?: string;
  name: string;
  link: string;
  type: TypeBanner;
  is_active: boolean;
  images?: BannerImageInterface[];
  desktop_image?: BannerImageInterface;
}

export interface FileObject {
  __key: string;
  name: string;
  lastModified: number;
  webkitRelativePath: string;
  size: number;
  type: string;
  filename?: string;
}
