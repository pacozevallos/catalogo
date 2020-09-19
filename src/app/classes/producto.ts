export class Producto {
    id?: string;
    familia?: {
      perro?: boolean;
      gato?: boolean;
    };
    categoria?: string;
    marca?: string;
    nombre?: string;
    descripcion?: string;
    image?: string;
    imageName?: string;
    precio?: number;
    descuento?: number;
    fechaCreacion?: string;
    publicado?: boolean;
    tipo?: string;
    presentaciones?: [{
      presentacion?: string;
      medida?: string;
      precio?: number;
    }];
}
