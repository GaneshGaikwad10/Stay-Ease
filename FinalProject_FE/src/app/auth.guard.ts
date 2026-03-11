import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserService } from './feature/services/user.service';

export const authGuard: CanActivateFn = (route, state) => {
  const userService = inject(UserService);
  const router = inject(Router);

  if (userService.getLoggedUserId()) {
    return true;
  }

  alert('Please login to access this page.');
  router.navigate(['/login']);
  return false;
};
