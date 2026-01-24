import { loginRequest } from '@domains/auth/services/auth.service'
import { LoginDTO } from '@domains/auth/types/auth.types'

// Mock de next/headers
const mockSet = jest.fn()
const mockCookies = jest.fn(() => ({
  set: mockSet,
}))

jest.mock('next/headers', () => ({
  cookies: () => mockCookies(),
}))

// Mock de fetch global
global.fetch = jest.fn()

describe('loginRequest', () => {
  const mockLoginDto: LoginDTO = {
    email: 'test@example.com',
    password: 'password123',
  }

  const mockToken = 'mock-jwt-token-12345'

  beforeEach(() => {
    jest.clearAllMocks()
    // Resetear el mock de fetch
    ;(global.fetch as jest.Mock).mockClear()
    mockSet.mockClear()
  })

  it('debería hacer login exitosamente y establecer la cookie', async () => {
    // Mock de respuesta exitosa
    const mockResponse = {
      ok: true,
      json: jest.fn().mockResolvedValue({
        token: mockToken,
      }),
    }

    ;(global.fetch as jest.Mock).mockResolvedValue(mockResponse)

    const result = await loginRequest(mockLoginDto)

    // Verificar que fetch fue llamado con los parámetros correctos
    expect(global.fetch).toHaveBeenCalledTimes(1)
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/auth/login'),
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mockLoginDto),
      }
    )

    // Verificar que la cookie fue establecida correctamente
    expect(mockSet).toHaveBeenCalledTimes(1)
    expect(mockSet).toHaveBeenCalledWith('access_token', mockToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    })

    // Verificar que retorna el token
    expect(result).toBe(mockToken)
  })

  it('debería lanzar error cuando las credenciales son incorrectas', async () => {
    // Mock de respuesta con error
    const mockResponse = {
      ok: false,
      status: 401,
      statusText: 'Unauthorized',
    }

    ;(global.fetch as jest.Mock).mockResolvedValue(mockResponse)

    // Verificar que lanza el error correcto
    await expect(loginRequest(mockLoginDto)).rejects.toThrow(
      'Credenciales incorrectas'
    )

    // Verificar que fetch fue llamado
    expect(global.fetch).toHaveBeenCalledTimes(1)

    // Verificar que NO se estableció la cookie
    expect(mockSet).not.toHaveBeenCalled()
  })

  it('debería establecer secure como true en producción', async () => {
    const originalEnv = process.env.NODE_ENV
    process.env.NODE_ENV = 'production'

    const mockResponse = {
      ok: true,
      json: jest.fn().mockResolvedValue({
        token: mockToken,
      }),
    }

    ;(global.fetch as jest.Mock).mockResolvedValue(mockResponse)

    await loginRequest(mockLoginDto)

    expect(mockSet).toHaveBeenCalledWith(
      'access_token',
      mockToken,
      expect.objectContaining({
        secure: true,
      })
    )

    // Restaurar el entorno original
    process.env.NODE_ENV = originalEnv
  })

  it('debería establecer secure como false en desarrollo', async () => {
    const originalEnv = process.env.NODE_ENV
    process.env.NODE_ENV = 'development'

    const mockResponse = {
      ok: true,
      json: jest.fn().mockResolvedValue({
        token: mockToken,
      }),
    }

    ;(global.fetch as jest.Mock).mockResolvedValue(mockResponse)

    await loginRequest(mockLoginDto)

    expect(mockSet).toHaveBeenCalledWith(
      'access_token',
      mockToken,
      expect.objectContaining({
        secure: false,
      })
    )

    // Restaurar el entorno original
    process.env.NODE_ENV = originalEnv
  })

  it('debería enviar el body correctamente serializado', async () => {
    const mockResponse = {
      ok: true,
      json: jest.fn().mockResolvedValue({
        token: mockToken,
      }),
    }

    ;(global.fetch as jest.Mock).mockResolvedValue(mockResponse)

    await loginRequest(mockLoginDto)

    const fetchCall = (global.fetch as jest.Mock).mock.calls[0]
    const body = JSON.parse(fetchCall[1].body)

    expect(body).toEqual(mockLoginDto)
    expect(body.email).toBe('test@example.com')
    expect(body.password).toBe('password123')
  })
})
