import { LOGIN_API_URL } from '../constants/urls';
import { LoginDTO } from '../types/auth.types';

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

    const { access_token } = await response.json();
    return access_token
  },

  async register() { }

}
