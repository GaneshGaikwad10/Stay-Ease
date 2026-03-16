import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserService } from '../feature/services/user.service';

export const authGuard: CanActivateFn = (route, state) => {
  const userService = inject(UserService);
  const router = inject(Router);
 
  // Check if we have a logged-in user ID in the service state
  if (userService.getLoggedUserId()) {
    return true;
  }
 
  // If not logged in then redirect to login page
  alert('Please login to access this page.');
  router.navigate(['/login']);
  return false;
};