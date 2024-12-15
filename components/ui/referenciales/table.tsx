// app/ui/referenciales/table.tsx

// 1. Importar tipos desde Prisma schema
import { referenciales } from '@prisma/client';
import { UpdateReferencial } from '@/components/ui/referenciales/buttons';
import { formatDateToLocal, formatCurrency } from '@/lib/utils';
import { fetchFilteredReferenciales } from '@/lib/referenciales';

// 2. Definir interfaz basada en el modelo
interface ReferencialTableProps {
  query: string;
  currentPage: number;
}

// 3. Definir tipo de claves del objeto referencial
type ReferencialKeys = keyof referenciales;

// 4. Campos alineados con schema.prisma
const TABLE_HEADERS: { key: ReferencialKeys, label: string }[] = [
  { key: 'cbr', label: 'CBR' },
  { key: 'fojas', label: 'Fojas' },
  { key: 'numero', label: 'Número' },
  { key: 'anio', label: 'Año' },
  { key: 'fechaescritura', label: 'Fecha de escritura' },
  { key: 'comuna', label: 'Comuna' },
  { key: 'rol', label: 'Rol' },
  { key: 'monto', label: 'Monto' },
  { key: 'superficie', label: 'Superficie' },
  { key: 'predio', label: 'Predio' },
  { key: 'comprador', label: 'Comprador' },
  { key: 'vendedor', label: 'Vendedor' }, // Agregar el campo "Vendedor"
  { key: 'observaciones', label: 'Observaciones' }, // Mover esta línea al final
];

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
              <div
                key={referencial.id}
                className="mb-2 w-full rounded-md bg-white p-4"
              >
                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    {TABLE_HEADERS.map(({ key, label }) => (
                      <p key={key} className={key === 'cbr' ? 'font-medium' : ''}>
                        {label}: {
                          key === 'fechaescritura' ? formatDateToLocal(referencial[key].toISOString()) :
                          key === 'monto' ? formatCurrency(referencial[key]) :
                          key === 'superficie' ? `${referencial[key]} m²` :
                          referencial[key]
                        }
                      </p>
                    ))}
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-4">
                  <UpdateReferencial id={referencial.id} />
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
                  <th scope="col" className="relative py-3 pl-6 pr-3">
                    <span className="sr-only">Editar</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {referenciales?.map((referencial: referenciales) => (
                  <tr
                    key={referencial.id}
                    className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                  >
                    {TABLE_HEADERS.map(({ key }) => (
                      <td key={key} className="whitespace-nowrap px-3 py-3">
                        {key === 'fechaescritura' ? formatDateToLocal(referencial[key].toISOString()) :
                         key === 'monto' ? formatCurrency(referencial[key]) :
                         key === 'superficie' ? `${referencial[key]} m²` :
                         referencial[key]}
                      </td>
                    ))}
                    <td className="whitespace-nowrap py-3 pl-6 pr-3">
                      <div className="flex justify-end gap-3">
                        <UpdateReferencial id={referencial.id} />
                      </div>
                    </td>
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