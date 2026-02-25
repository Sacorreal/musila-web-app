/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  serverActions: {
    // Límite de tamaño de body para Server Actions (formularios, etc.)
    // Ajusta según tu necesidad: '10mb', '50mb', '100mb'...
    bodySizeLimit: '50mb',
  },
  api: {
    bodyParser: {
      // Límite de tamaño del body para peticiones (subidas de audio, etc.)
      // Puedes ajustar este valor según tus necesidades: '10mb', '50mb', '100mb', etc.
      sizeLimit: '50mb',
    },
  },
};

export default nextConfig