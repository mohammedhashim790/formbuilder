import {CanActivateFn, Router} from '@angular/router';
import {inject} from "@angular/core";

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const {requiresAuth} = route.data;
  if (requiresAuth ?? false) {
    // TODO, check if user is authorised, if not redirect to sign in
    // router.navigate(['/login']);
    // return false;
  }
  return true;
};
