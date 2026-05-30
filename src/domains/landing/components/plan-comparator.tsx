'use client';

import { COMPARATOR_ROWS } from '../constants/plans';

export function PlanComparator() {
  const headers = ['Característica', 'Autor Free', 'Autor Pro', 'Cantautor Free', 'Cantautor Pro', 'Intérprete Free', 'Intérprete Pro'];

  return (
    <div className="mt-16">
      <h3 className="mb-6 text-center text-xl font-semibold text-foreground">
        Comparador de planes
      </h3>
      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full min-w-[700px] text-sm" role="table" aria-label="Comparador de planes Musila">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              {headers.map((h) => (
                <th
                  key={h}
                  scope="col"
                  className="px-4 py-3 text-left font-semibold text-foreground first:sticky first:left-0 first:bg-muted/50"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {COMPARATOR_ROWS.map((row, i) => (
              <tr
                key={row.feature}
                className={i % 2 === 0 ? 'bg-background' : 'bg-card/50'}
              >
                <td className="sticky left-0 bg-inherit px-4 py-3 font-medium text-foreground">
                  {row.feature}
                </td>
                <td className="px-4 py-3 text-muted-foreground">{row.autor_free}</td>
                <td className="px-4 py-3 font-medium text-primary">{row.autor_pro}</td>
                <td className="px-4 py-3 text-muted-foreground">{row.cantautor_free}</td>
                <td className="px-4 py-3 font-medium text-primary">{row.cantautor_pro}</td>
                <td className="px-4 py-3 text-muted-foreground">{row.interprete_free}</td>
                <td className="px-4 py-3 font-medium text-primary">{row.interprete_pro}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
