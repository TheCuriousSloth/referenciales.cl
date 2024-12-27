// app/ui/referenciales/table.tsx

// Importar tipos desde Prisma schema
import { referenciales } from '@prisma/client';
import { formatDateToLocal } from '@/lib/utils';
import { fetchFilteredReferenciales } from '@/lib/referenciales';

// Mantener la definición de campos sensibles
const SENSITIVE_FIELDS = ['comprador', 'vendedor'];
const isSensitiveField = (key: string) => SENSITIVE_FIELDS.includes(key);

// Función helper para manejar la visualización de datos sensibles
const formatFieldValue = (key: string, value: any) => {
  if (isSensitiveField(key)) {
    return '• • • • •'; // Placeholder para datos sensibles
  }

  // Formatear según el tipo de campo
  if (key === 'fechaescritura' && value) {
    return formatDateToLocal(value.toISOString());
  }
  if ((key === 'monto' || key === 'superficie') && value) {
    return value.toLocaleString('es-CL');
  }
  return value;
}; // Agregar llave de cierre aquí

// Definir interfaz basada en el modelo
interface ReferencialTableProps {
  query: string;
  currentPage: number;
}

// Definir tipo de claves del objeto referencial
type ReferencialKeys = keyof referenciales;

// Campos alineados con schema.prisma
const TABLE_HEADERS: { key: ReferencialKeys, label: string }[] = [
  { key: 'cbr', label: 'CBR' },
  { key: 'fojas', label: 'Fojas' },
  { key: 'numero', label: 'Número' },
  { key: 'anio', label: 'Año' },
  { key: 'comprador', label: 'Comprador' },
  { key: 'vendedor', label: 'Vendedor' },
  { key: 'predio', label: 'Predio' },
  { key: 'comuna', label: 'Comuna' },
  { key: 'rol', label: 'Rol' },
  { key: 'fechaescritura', label: 'Fecha de escritura' },
  { key: 'monto', label: 'Monto ($)' },
  { key: 'superficie', label: 'Superficie (m²)' },
  { key: 'observaciones', label: 'Observaciones' },
];

// Función para formatear números con punto como separador de miles
const formatNumber = (num: number) => {
  return num.toLocaleString('es-CL');
};

export default async function ReferencialesTable({
  query,
  currentPage,
}: ReferencialTableProps) {
  const referenciales = await fetchFilteredReferenciales(query, currentPage);

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          {/* Vista móvil */}
          <div className="md:hidden">
            {referenciales?.map((referencial: referenciales) => (
              <div key={referencial.id} className="mb-2 w-full rounded-md bg-white p-4">
                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    {TABLE_HEADERS.map(({ key, label }) => (
                      <p key={key} className={key === 'cbr' ? 'font-medium' : ''}>
                        {label}: {formatFieldValue(key, referencial[key])}
                                                  </p>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Vista desktop */}
          <div className="hidden md:block overflow-x-auto">
            <table className="min-w-full text-gray-900">
              <thead className="rounded-lg text-left text-sm font-normal">
                <tr>
                  {TABLE_HEADERS.map(({ key, label }) => (
                    <th key={key} scope="col" className="px-3 py-5 font-medium">
                      {label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white">
                {referenciales?.map((referencial: referenciales) => (
                  <tr key={referencial.id} 
                      className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg">
                    {TABLE_HEADERS.map(({ key }) => (
                      <td key={key} className="whitespace-nowrap px-3 py-3">
                        {formatFieldValue(key, referencial[key])}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}   