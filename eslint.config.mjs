import next from 'eslint-config-next'

/**
 * Flat config para Next 16. `eslint-config-next` ya exporta la configuración
 * plana (core-web-vitals + typescript + react-hooks + jsx-a11y + import), así
 * que se compone directamente, sin `FlatCompat`.
 */
const eslintConfig = [
  {
    ignores: [
      '.next/**',
      'out/**',
      'build/**',
      'node_modules/**',
      'next-env.d.ts',
      'coverage/**',
    ],
  },
  ...next,
  {
    /*
     * Reglas heredadas degradadas a `warn` para el primer arranque: el codebase
     * es anterior a estas reglas (React Compiler / Next 16) y todas provienen de
     * código existente. Se mantienen visibles como advertencias para irlas
     * corrigiendo gradualmente, sin bloquear `pnpm run lint`. El código nuevo
     * debe evitarlas de todos modos.
     */
    rules: {
      'react-hooks/set-state-in-effect': 'warn',
      'react-hooks/error-boundaries': 'warn',
      'react-hooks/incompatible-library': 'warn',
      'react-hooks/refs': 'warn',
      'react-hooks/purity': 'warn',
      'react-hooks/immutability': 'warn',
      'react-hooks/exhaustive-deps': 'warn',
      '@next/next/no-img-element': 'warn',
      'react/no-unescaped-entities': 'warn',
      'jsx-a11y/alt-text': 'warn',
    },
  },
]

export default eslintConfig
