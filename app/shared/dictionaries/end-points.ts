// @ts-ignore
import { environment } from "@environment";

const apiService =
  environment.env === 'staging'
    ? environment.apiTest
    : environment.env === 'staging'
    ? environment.apiStaging
    : environment.api;

export const endPoints = {
  auth: `${apiService}login`,
  resetPassword: `${apiService}reset-password`,
  burdensBalance: `${apiService}swan/balance`,
  invoices: `${apiService}swan/invoices?sort=id_desc`,
  invoicesDetail: `${apiService}swan/:id?expand=structure,storeLocation&include_products=true`,
  invoicesDetailWTracking: `${apiService}swan/:id?expand=tracking,storeLocation&include_products=true`,
  downloadInvoicesDetail: `${apiService}swan/invoices/:id/download?base64=true`,
  news: `${apiService}news?category=swan_blog`,
  // statements: `${apiService}swan/statements?sort=id_desc`,
  // statements: `${apiService}swan/statements?sort=id_desc`,
  // downloadStatementDetail: `${apiService}swan/statements/:id/download?base64=true`,
  searchInvoices: `${apiService}swan/search?sort=date_desc`,
  payment: `${apiService}swan/payment`,
  generateOrder: `${apiService}material-orders`,
  supplierId: `${apiService}swan/supplier`,
  stores: `${apiService}swan/stores`,
  jobs: `${apiService}jobs`,
  products: `${apiService}products`,
  product: `${apiService}products/:id`,

  setFavorite: `${apiService}products/:id/favourite`,
  suppliers: `${apiService}swan/supplier`,

  categories: `${apiService}products/categories`,
  productsCategories: `${apiService}products/categories`,
  newPrice: `${apiService}products/:id/price`,
  preferredStore: `${apiService}swan/stores/preferred`,
  shareOrder: `${apiService}material-orders/:id/share`,
  orders: `${apiService}material-orders?sort=id_desc&include_products=true`,
  // estimatorRoofing:
  //   'https://burdenstradetrakroofestimator.paperform.co/?email=:emailUser&name=:fullName&company=:companyName&burdens_account=:accountNumber',
  forgotPassword: `${apiService}reset-password`,
  refresh: `${apiService}swan/refresh`,
  promotions: `${apiService}swan/promotions`,
  swanVersion: `${apiService}app-version/swan-app`
  // getValidationRules: `${apiService}swan/validation-rules`,
};
