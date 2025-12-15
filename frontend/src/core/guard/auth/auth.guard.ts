import {CanActivateFn, Router} from '@angular/router';
import {inject} from "@angular/core";
import {AuthManager} from '../../auth/AuthManager';


export const authGuard: CanActivateFn = (route, state) => {


  const authManager = inject(AuthManager);
  authManager.load();
  const router = inject(Router);
  const {requiresAuth} = route.data;
  // if ((requiresAuth ?? false) && !authManager.user.isSignedIn) {
  //   // TODO, check if user is authorised, if not redirect to sign in
  //   router.navigate(['/login']);
  //   return false;
  // }
  return true;
};
