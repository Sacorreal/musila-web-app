import { LOGIN_API_URL } from '../constants/urls';
import { LoginDTO, loginResponse } from '../types/auth.types';

export const authService = {
  async login(loginDto: LoginDTO): Promise<string> {

    const response = await fetch(LOGIN_API_URL, {
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(loginDto),
    });

    if (!response.ok) {
      throw new Error("Credenciales incorrectas");
    }

    const data: loginResponse = await response.json()

    return data.token
  },

  async register() { }

}
