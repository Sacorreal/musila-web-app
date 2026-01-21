import { LOGIN_API_URL } from './constants/urls';
import { LoginDTO } from './types';

export const authService = {
  async login(loginDto: LoginDTO) {

    const response = await fetch(LOGIN_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: loginDto.email,
        password: loginDto.password,
      }),
    });

    if (!response.ok) {
      throw new Error("Credenciales incorrectas");
    }

    const data = await response.json();
    return data.access_token;
  },

  async register() { }

}
