/* eslint-disable @typescript-eslint/no-explicit-any */
import { useAuthStore } from "src/stores/auth";

export class Utils {
  model: string;

  constructor(modalData: string) {
    this.model = modalData;
  }

  formatPrice(price: number | undefined): string {
    // Convertir el valor en un número si es necesario
    const number = Number(price);
    if (isNaN(number)) {
        throw new Error("El valor proporcionado no es un número válido.");
    }

    // Formatear el número con separadores de miles (')
    const formatter = new Intl.NumberFormat('es-CO', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    });

    const formattedNumber = formatter.format(number).replace(/\./g, "'");

    // Agregar el símbolo de moneda
    return `$ ${formattedNumber}`;
  }

  validatePermission(available: string): boolean {
    const store = useAuthStore();
    const permissions =
      store.user.scopes && store.user.scopes.length > 0
        ? store.user.scopes
        : [];
    let enable = false;
    if (permissions && permissions.length > 0) {
      for (const permission of permissions) {
        if (permission !== available) {
          enable = false;
        } else {
          enable = true;
          break;
        }
      }
    }
    return enable;
  }

  transformObjectInFormData(
    object: any,
    hasFile: boolean,
    file: File | null | undefined | any
  ): FormData {
    const formData = new FormData();
    const keysObj = Object.keys(object);
    for (const keyObj of keysObj) {
      if (
        Array.isArray(object[keyObj]) ||
        (object[keyObj] &&
          typeof object[keyObj] === "object" &&
          !object[keyObj].size &&
          !object[keyObj].lastModified)
      ) {
        // Si el valor es un array, se agrega cada elemento con el mismo nombre en el FormData
        formData.append(`${keyObj}`, JSON.stringify(object[keyObj]));
      } else {
        formData.append(keyObj, object[keyObj]);
      }
    }
    if (hasFile && file && !Array.isArray(file)) {
      formData.append("file", file);
    }
    if (Array.isArray(file)) {
      file.forEach((item: File) => {
        formData.append("file", item);
      });
    }
    return formData;
  }

  valdiateDate(value: string): boolean {
    if (value) {
      const regex = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/;
      return regex.test(value);
    }
    return true;
  }

  valdiateFile(value: any): boolean {
    if (value) {
      const regex = /^.*\.(png|jpg|jpeg|webp|pdf|svg)$/;
      return regex.test(value.name);
    }
    return true;
  }

  getCurrentQueryParams() {
    // Obtener la URL actual desde la ventana
    const currentUrl = window.location.href;
    // Crear un objeto URL con la URL actual
    const urlObj = new URL(currentUrl);
    // Crear un objeto para almacenar los query params
    const queryParams: any = {};
    // Iterar sobre los pares clave/valor de los query params
    urlObj.searchParams.forEach((value, key) => {
      queryParams[key] = value;
    });
    return queryParams;
  }
}
