import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const cloneRequest = req.clone({
    setHeaders:{
      "Content-Type": "application/json" ,
      "Authorization": localStorage.getItem("authToken") || ""
       
    }
   
  })
 
  return next(cloneRequest);
};