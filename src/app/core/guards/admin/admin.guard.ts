import { CanActivateFn } from '@angular/router';
import { inject, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { isPlatformBrowser } from '@angular/common';

export const adminGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);
  
  let token: string | null = null;
  if (typeof window !== 'undefined' && window.localStorage) {
    token = localStorage.getItem('token');
  }

  if (!isPlatformBrowser(platformId)) {
    // On the server, we don't have localStorage so we can't check the token.
    // We return false to prevent rendering protected content, but do NOT redirect
    // to avoid flashing the login page before the client hydrates.
    return false;
  }

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