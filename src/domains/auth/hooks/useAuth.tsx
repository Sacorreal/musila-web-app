'use client';

import { useEffect, useCallback } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { decodeToken } from '../utils/decodeToken';
import { loginRequest, registerUserRequest } from '../services/auth.service';



import type { LoginDTO } from '../types/auth.types';
import type { CreateUserDTO } from '@domains/users/types/user.type';
import {  deleteCookie } from '../utils/authActions';

// Utilidad nativa para leer cookies en el cliente sin librerías extra
const getClientSideCookie = (name: string) => {
    // Verificamos typeof document para evitar errores de hidratación en SSR
    if (typeof document === 'undefined') return null;
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift();
    return null;
};

export function useAuth() {
    const setSession = useAuthStore((s) => s.setSession);
    const clearSession = useAuthStore((s) => s.clearSession);

    const processToken = useCallback((newToken: string) => {
        const decoded = decodeToken(newToken);
        const now = Math.floor(Date.now() / 1000);

        if (decoded.exp < now) {
            throw new Error('Token expirado');
        }

        setSession({
            user: {
                email: decoded.email,
                id: decoded.id,
                role: decoded.role,
                name: decoded.name
            }
        });
    }, [setSession]);

    const login = async (dto: LoginDTO) => {
        const newToken = await loginRequest(dto);        
        processToken(newToken);
    };

    const registerUser = async (dto: CreateUserDTO) => {

        try {
            // 1. Petición al Backend
            const token = await registerUserRequest(dto)          
      
            // 2. Actualizar Estado Global (Zustand)
            processToken(token);
            
          } catch (error: any) {
            console.error("Error en registro:", error.message)
            throw error // Re-lanzar para que el formulario lo muestre
          }
        };
              
    

    const logout = useCallback(async () => {
        await deleteCookie();
        clearSession();
    }, [clearSession]);

    const verifySession = useCallback(() => {        
        const token = getClientSideCookie('access_token');        
        if (!token) {
            clearSession();
            return;
        }

        try {
            const decoded = decodeToken(token);
            const now = Math.floor(Date.now() / 1000);

            if (decoded.exp < now) {
                clearSession();
            } else {               
                const currentUser = useAuthStore.getState().user;
                if (!currentUser) {
                    processToken(token);
                }
            }
        } catch {
            clearSession();
        }
    }, [clearSession, processToken]);

    useEffect(() => {
        verifySession();
    }, [verifySession]);

    return {
        login,
        registerUser,
        logout,
        verifySession,
    };
}