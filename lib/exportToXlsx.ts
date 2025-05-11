// lib/exportToXlsx.ts
import ExcelJS from 'exceljs';

// Definimos una interfaz para los datos exportables
interface ExportableReferencial {
  id: string;
  lat: number;
  lng: number;
  fojas: string;
  numero: number;
  anio: number;
  cbr: string;
  comprador: string;
  vendedor: string;
  predio: string;
  comuna: string;
  rol: string;
  fechaescritura: Date;
  superficie: number;
  monto: number | bigint | null;
  observaciones: string | null;
  userId: string;
  conservadorId: string;
  createdAt: Date;
  updatedAt: Date;
  [key: string]: any; // Para permitir propiedades adicionales como conservadorNombre
}

export const exportReferencialesToXlsx = async (
  referenciales: ExportableReferencial[], 
  headers: { key: string, label: string }[]
) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Referenciales');

  // Agregar encabezados
  worksheet.columns = headers.map(header => ({
    header: header.label,
    key: header.key as string,
    width: 20,
  }));

  // Agregar filas
  referenciales.forEach(referencial => {
    const row: { [key: string]: any } = {};
    headers.forEach(({ key }) => {
      if (referencial.hasOwnProperty(key)) {
        row[key as string] = referencial[key];
      } else {
        row[key as string] = '';
      }
    });
    worksheet.addRow(row);
  });

  // Generar el buffer del archivo
  const buffer = await workbook.xlsx.writeBuffer();
  return buffer;
};