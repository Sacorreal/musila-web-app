import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const domainName = process.argv[2];

if (!domainName) {
  console.error('❌ Por favor, indica el nombre del dominio (ej: pnpm run generate:domain playlist)');
  process.exit(1);
}

// Convertimos a kebab-case para los archivos
const fileName = domainName.toLowerCase().replace(/\s+/g, '-');
// Convertimos a PascalCase para los tipos/nombres de funciones
const pascalName = domainName
  .replace(new RegExp(/[-_]+/, 'g'), ' ')
  .replace(new RegExp(/[^\w\s]/, 'g'), '')
  .replace(
    new RegExp(/\s+(.)(\w*)/, 'g'),
    ($1, $2, $3) => `${$2.toUpperCase() + $3.toLowerCase()}`
  )
  .replace(new RegExp(/\w/), (s) => s.toUpperCase());

const baseDir = path.join(__dirname, `../src/domains/${fileName}`);

const dirs = [
  'components',
  'hooks',
  'services',
  'validations',
  'types',
];

const files = [
  {
    path: `validations/${fileName}.schema.ts`,
    content: `import * as z from 'zod';\n\nexport const ${pascalName}Schema = z.object({\n  // Define your schema here\n});\n\nexport type ${pascalName}FormValues = z.infer<typeof ${pascalName}Schema>;\n`
  },
  {
    path: `services/${fileName}.actions.ts`,
    content: `'use server'\n\nimport { getServerApiClient } from '@/src/shared/api/axios-server';\nimport { apiURLs } from '@/src/shared/constants/urls';\n\nexport async function create${pascalName}Action(data: any) {\n  const client = await getServerApiClient();\n  const response = await client.post(apiURLs.${fileName}s.all, data);\n  return response.data;\n}\n`
  },
  {
    path: `hooks/use-${fileName}.hooks.ts`,
    content: `'use client'\n\nimport { useMutation, useQueryClient } from '@tanstack/react-query';\nimport { create${pascalName}Action } from '../services/${fileName}.actions';\n\nexport function useCreate${pascalName}() {\n  const queryClient = useQueryClient();\n\n  return useMutation({\n    mutationFn: create${pascalName}Action,\n    onSuccess: () => {\n      queryClient.invalidateQueries({ queryKey: ['${fileName}s'] });\n    },\n  });\n}\n`
  },
  {
    path: `types/${fileName}.types.ts`,
    content: `export interface ${pascalName} {\n  id: string;\n  createdAt: string;\n  updatedAt: string;\n}\n`
  }
];

// Crear directorios
console.log(`🚀 Generando dominio: ${pascalName}...`);

if (fs.existsSync(baseDir)) {
  console.error(`❌ El dominio "${fileName}" ya existe.`);
  process.exit(1);
}

fs.mkdirSync(baseDir, { recursive: true });

dirs.forEach(dir => {
  fs.mkdirSync(path.join(baseDir, dir), { recursive: true });
});

// Crear archivos
files.forEach(file => {
  fs.writeFileSync(path.join(baseDir, file.path), file.content);
  console.log(`  ✅ Creado: ${file.path}`);
});

console.log(`\n🎉 ¡Dominio ${pascalName} generado con éxito en src/domains/${fileName}!`);