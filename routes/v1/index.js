const express = require('express');
const testRoute = require('./test.route');
const userRoute = require('./userRoutes');
const productCategoryRoute = require('./productCategory.routes');
const productSubCategoryRoute = require('./productSubCategory.routes');

const router = express.Router();

const defaultRoutes = [
  {
    path: '/test',
    route: testRoute,
  },
  {
    path: '/users',
    route: userRoute,
  },
  {
    path: '/category',
    route: productCategoryRoute,
  },
  {
    path: '/sub-category',
    route: productSubCategoryRoute,
  },
];

// const devRoutes = [
//   // routes available only in development mode
//   {
//     path: '/test',
//     route: testRoute,
//   },
//   {
//     path: '/users',
//     route: userRoute,
//   },
// ];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

/* only for development purpose */
// if (process.env === 'development') {
//   devRoutes.forEach((route) => {
//     router.use(route.path, route.route);
//   });
// }

module.exports = router;
