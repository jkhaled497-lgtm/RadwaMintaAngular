import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

export const loginGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const token = localStorage.getItem('token');

  if (token) {
    try {
      const decodedToken: any = jwtDecode(token);
      const isTokenExpired = decodedToken.exp < Date.now() / 1000;
      if (!isTokenExpired) {
        router.navigate(['/dashboard']);
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