/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
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