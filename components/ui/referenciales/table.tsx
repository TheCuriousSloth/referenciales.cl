"use client";

import { formatDateToLocal } from '@/lib/utils';
import { Referencial } from '@/types/referenciales';

const SENSITIVE_FIELDS = ['comprador', 'vendedor'];
const isSensitiveField = (key: string) => SENSITIVE_FIELDS.includes(key);

const formatFieldValue = (key: string, value: any, referencial: Referencial) => {
  if (isSensitiveField(key)) {
    return '• • • • •';
  }

  if (key === 'fechaescritura' && value) {
    return formatDateToLocal(new Date(value).toISOString());
  }
  if ((key === 'monto' || key === 'superficie') && value !== undefined) {
    return value.toLocaleString('es-CL');
  }
  if (key === 'conservador' && referencial.conservador) {
    return referencial.conservador.nombre;
  }
  return value || '';
};

interface ReferencialTableProps {
  query: string;
  currentPage: number;
  referenciales: Referencial[]; // Usamos Referencial directamente
}

type BaseKeys = keyof Omit<Referencial, 'user' | 'conservador'>;
type DisplayKeys = BaseKeys | 'conservador';

const ALL_TABLE_HEADERS: { key: DisplayKeys, label: string }[] = [
  { key: 'cbr', label: 'CBR' },
  { key: 'fojas', label: 'Fojas' },
  { key: 'numero', label: 'Número' },
  { key: 'anio', label: 'Año' },
  { key: 'predio', label: 'Predio' },
  { key: 'comuna', label: 'Comuna' },
  { key: 'rol', label: 'Rol' },
  { key: 'fechaescritura', label: 'Fecha de escritura' },
  { key: 'monto', label: 'Monto ($)' },
  { key: 'superficie', label: 'Superficie (m²)' },
  { key: 'observaciones', label: 'Observaciones' },
  { key: 'conservador', label: 'Conservador' },
];

const VISIBLE_HEADERS = ALL_TABLE_HEADERS.filter(
  header => !SENSITIVE_FIELDS.includes(header.key)
);

export default function ReferencialesTable({
  query,
  currentPage,
  referenciales, // Recibe los datos como prop
}: ReferencialTableProps) {
  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        {/* Mostrar información de la página actual */}
        <div className="text-sm text-gray-500 mb-2">
          Mostrando página {currentPage} {query ? `con filtro "${query}"` : ""}
        </div>
        
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          {referenciales.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-gray-500">No hay resultados para mostrar</p>
              {query && <p className="text-sm text-gray-400 mt-2">Prueba con una búsqueda diferente</p>}
            </div>
          ) : (
            <>
              {/* Vista móvil */}
              <div className="md:hidden">
                {referenciales.map((referencial) => (
                  <div key={referencial.id} className="mb-2 w-full rounded-md bg-white p-4">
                    <div className="flex items-center justify-between border-b pb-4">
                      <div>
                        {VISIBLE_HEADERS.map(({ key, label }) => (
                          <p key={key} className={key === 'cbr' ? 'font-medium' : ''}>
                            {label}: {
                              key === 'conservador' 
                                ? (referencial.conservador?.nombre || '-') 
                                : formatFieldValue(key, (referencial as any)[key], referencial)
                            }
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
                      {VISIBLE_HEADERS.map(({ key, label }) => (
                        <th key={key} scope="col" className="px-3 py-5 font-medium">
                          {label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white">
                    {referenciales.map((referencial) => (
                      <tr key={referencial.id} 
                          className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg">
                        {VISIBLE_HEADERS.map(({ key }) => (
                          <td key={key} className="whitespace-nowrap px-3 py-3">
                            {key === 'conservador' 
                              ? (referencial.conservador?.nombre || '-') 
                              : formatFieldValue(key, (referencial as any)[key], referencial)
                            }
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}