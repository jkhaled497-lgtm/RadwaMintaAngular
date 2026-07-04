import { HttpInterceptorFn } from '@angular/common/http';

export const paramsLangInterceptor: HttpInterceptorFn = (req, next) => {
  const lang =
    typeof window !== 'undefined' && window.localStorage
      ? localStorage.getItem('lang') || 'en'
      : 'en';

  const clonedReq = req.clone({
    setParams: { lang }
  });

  return next(clonedReq);
};
