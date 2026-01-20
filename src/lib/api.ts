const API_BASE_URL = "https://musila-api.up.railway.app"

interface ApiResponse<T> {
  data: T | null
  error: string | null
}

async function fetchApi<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
  try {
    const token = typeof window !== "undefined" ? localStorage.getItem("musila_token") : null

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    }

    if (token) {
      headers["Authorization"] = `Bearer ${token}`
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        ...headers,
        ...(options.headers as Record<string, string>),
      },
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || `Error ${response.status}`)
    }

    const data = await response.json()
    return { data, error: null }
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : "Error desconocido",
    }
  }
}

function get<T>(endpoint: string) {
  return fetchApi<T>(endpoint, { method: "GET" })
}

function post<T>(endpoint: string, body: unknown) {
  return fetchApi<T>(endpoint, {
    method: "POST",
    body: JSON.stringify(body),
  })
}

function put<T>(endpoint: string, body: unknown) {
  return fetchApi<T>(endpoint, {
    method: "PUT",
    body: JSON.stringify(body),
  })
}

function del<T>(endpoint: string) {
  return fetchApi<T>(endpoint, { method: "DELETE" })
}

function postFormData<T>(endpoint: string, formData: FormData) {
  return fetchApi<T>(endpoint, {
    method: "POST",
    body: formData,
    headers: {},
  })
}

export const api = {
  get,
  post,
  put,
  delete: del,
  postFormData,
}
