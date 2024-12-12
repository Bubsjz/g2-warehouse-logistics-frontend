import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../environments/environment';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const cloneRequest = req.clone({
    setHeaders:{
     
      "Authorization": localStorage.getItem(environment.TOKEN_KEY) || ""
       
    }
   
  })
 
  return next(cloneRequest);
};
