const express = require('express');
const testRoute = require('./test.route');

const router = express.Router();

const defaultRoutes = [
  {
    path: '/test',
    route: testRoute,
  },
];

const devRoutes = [
  // routes available only in development mode
  {
    path: '/test',
    route: testRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

/* istanbul ignore next */
if (process.env === 'development') {
  devRoutes.forEach((route) => {
    router.use(route.path, route.route);
  });
}

module.exports = router;
