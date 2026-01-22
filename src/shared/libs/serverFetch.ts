'use server'
import { cookies } from 'next/headers'

export async function serverFetch(
    url: string,
    options: RequestInit = {}
) {
    const cookieStore = await cookies()
    const token = cookieStore.get('access_token')?.value

    return fetch(`${process.env.BASE_API_URL}${url}`, {
        ...options,
        headers: {
            ...options.headers,
            Authorization: `Bearer ${token}`,
        },
    })
}
