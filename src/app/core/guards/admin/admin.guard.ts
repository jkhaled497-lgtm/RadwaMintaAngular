import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

export const adminGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const token = localStorage.getItem("token");

  if (!token) {
    router.navigate(['/login']);
    return false;
  }

  try {
    const decodedToken: any = jwtDecode(token);
    const currentTime = Date.now() / 1000;

    if (decodedToken.exp < currentTime) {
      localStorage.removeItem("token");
      router.navigate(['/login']);
      return false;
    }
    return true;

  } catch (error) {
    localStorage.removeItem("token");
    router.navigate(['/login']);
    return false;
  }
};