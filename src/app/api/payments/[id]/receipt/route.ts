import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const cookieStore = await cookies();
  const token = cookieStore.get('access_token')?.value;

  if (!token) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  let response: Response;
  try {
    response = await fetch(`${BACKEND_URL}/payments/${id}/receipt`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
    });
  } catch {
    return NextResponse.json({ error: 'No se pudo conectar con el servidor' }, { status: 503 });
  }

  if (!response.ok) {
    const body = await response.text().catch(() => '');
    const message = (() => {
      try { return (JSON.parse(body) as any).message ?? 'No se pudo obtener el comprobante'; }
      catch { return 'No se pudo obtener el comprobante'; }
    })();
    return NextResponse.json({ error: message }, { status: response.status });
  }

  let buffer: ArrayBuffer;
  try {
    buffer = await response.arrayBuffer();
  } catch {
    return NextResponse.json({ error: 'Error al leer la respuesta del servidor' }, { status: 502 });
  }

  return new NextResponse(buffer, {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="comprobante-musila-${id.substring(0, 8)}.pdf"`,
    },
  });
}
