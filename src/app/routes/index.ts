import express from 'express';
import { AdminRoutes } from '../modules/admins/admin.route';
import { AuthRoutes } from '../modules/auth/auth.route';
import { CowRoutes } from '../modules/cow/cow.route';
import { OrderRoutes } from '../modules/orders/order.route';
import { UserRoutes } from '../modules/user/user.route';

const router = express.Router();

const moduleRoutes = [
  {
    path: '/auth',
    route: AuthRoutes,
  },
  {
    path: '/users',
    route: UserRoutes,
  },
  {
    path: '/admins',
    route: AdminRoutes,
  },
  {
    path: '/cows',
    route: CowRoutes,
  },
  {
    path: '/orders',
    route: OrderRoutes,
  },
];
moduleRoutes.forEach(route => {
  router.use(route.path, route.route);
});

export default router;
