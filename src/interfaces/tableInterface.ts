export interface TableColumnsInterface {
  name: string;
  label: string;
  field: string | ((row: any) => any);
  required?: boolean;
  align?: "left" | "right" | "center";
  sortable?: boolean;
  sort?: ((a: any, b: any, rowA: any, rowB: any) => number) | undefined;
  format?: ((val: any, row: any) => string) | undefined;
  classes?: string | undefined;
  style?: string | undefined;
  headerClasses?: string | undefined;
  headerStyle?: string | undefined;
}
