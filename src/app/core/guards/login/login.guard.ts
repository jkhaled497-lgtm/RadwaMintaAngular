import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

export const loginGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  let token: string | null = null;
  if (typeof window !== 'undefined' && window.localStorage) {
    token = localStorage.getItem('token');
  }

  if (token) {
    try {
      const decodedToken: any = jwtDecode(token);
      const isTokenExpired = decodedToken.exp < Date.now() / 1000;
      if (!isTokenExpired) {
        router.navigate(['/home']);
        return false;
      } else {
        localStorage.removeItem('token');
        return true;
      }
    } catch (error) {
      localStorage.removeItem('token');
      return true;
    }
  }
  return true;
};