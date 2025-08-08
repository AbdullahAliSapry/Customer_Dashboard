export const EndPoints = {
  //auth
  login: "Account/Login",

  //plans
  plans: "Plan",
  plan: (planId: string) => `Plan/${planId}`,

  //users
  user: (userId: string) => `User/getmaindata/${userId}`,

  //maincutomer
  maincustomeraddmaindata: (userid: string) =>
    `MainCustomer/addmaindata/${userid}`,
  maincustomeraddregisterdata: (userid: string) =>
    `MainCustomer/addregisterdata/${userid}`,
  maincustomeraddfreelancerlicense: (userid: string) =>
    `MainCustomer/addfreelancerlicense/${userid}`,
  maincustomeraddbankaccount: (userid: string) =>
    `MainCustomer/addbankaccount/${userid}`,
  maincustomeraddtaxdata: (userid: string) =>
    `MainCustomer/addtaxdata/${userid}`,
  maincustomergetdata: (userid: string) => `MainCustomer/getalldata/${userid}`,

  //store
  store: (storeId: string) => `Stores/${storeId}`,
  storesbyuser: (userId: string) => `Store/userid/${userId}`,
  storebyownerid: (ownerid: string) => `Stores/MainCustomer/${ownerid}`,
  createStore: "Stores",
  storecustomization: (storeId: string, templeteId: string) =>
    `Stores/customize/${storeId}/${templeteId}`,
  //customers
  customersbystore: (storeId: string) => `Customer/Store/${storeId}`,
  customer: (customerId: string) => `Customer/${customerId}`,

  //store customers
  storecustomers: (storeId: string) => `StoreCustomer/Store/${storeId}`,
  storecustomer: (storeId: string, customerId: string) =>
    `StoreCustomer/${storeId}/${customerId}`,

  //orders
  orders: (storeId: string) => `Order/getallordrs/${storeId}`,
  order: (storeId: string, orderId: string) => `Order/${storeId}/${orderId}`,

  //payments
  payments: (storeId: string) => `Payment/Store/${storeId}`,
  payment: (storeId: string, paymentId: string) =>
    `Payment/${storeId}/${paymentId}`,
  paymentsByOrder: (storeId: string, orderId: string) =>
    `Payment/Order/${storeId}/${orderId}`,

  //categories
  categories: (storeId: string) => `Category/Store/${storeId}`,
  category: `Category`,

  //products
  products: (storeId: string) => `Product/Store/${storeId}`,
  product: `Product`,

  //templates
  templates: "TemplateData",
  template: (templateId: string) => `TemplateData/${templateId}`,

  //shipping
  createShippingToStore: (storeId: string, userId: string) =>
    `Shipping/createshippingtostore/${userId}/${storeId}`,

  //tickets
  tickets: (userId: string) => `Tickets/getticketstouser/${userId}`,
  ticket: (ticketId: string) => `Tickets/getTicket/${ticketId}`,
  ticketMessages: (ticketId: string) => `Tickets/messages/${ticketId}`,
  createTicket: "Tickets/createTicket",
  // check-on-steps/{userId}"
  //check customer steps
  checkCustomerSteps: "MainCustomer/check-on-steps",

  //manager details
  addManagerDetailsMainCustomer: (userId: string) =>
    `MainCustomer/addManagerDetailsMainCustomer/${userId}`,

  //store hours
  storeHours: (storeId: string) => `Stores/get-working-hours/${storeId}`,
  storeHoursCreate: "Stores/add-working-hours",

  storeHoursUpdate: (id: string) => `Stores/update-working-hour/${id}`,
  // delete-working-hour/{id}
  storeHoursDelete: (id: string) => `Stores/delete-working-hour/${id}`,

  //price offers
  GetPriceOffers: (storeId: string) => `PriceOffer/get-all-to-store/${storeId}`,
  addPriceOffer: (userId: string) => `PriceOffer/add-price-offer/${userId}`,
  updatePriceOffer: `PriceOffer/update-offer`,
  priceOffer: `PriceOffer/get-price-offer`,
  checkShippingIsActive: (storeId: string) =>
    `Shipping/check-shipping-isActive/${storeId}`,

  //translation
  addLanguage: "Language/add-lang",
  getLanguagesByStore: (storeId: string) => `Language/get-all-store/${storeId}`,
  deleteLanguage: (languageId: string) => `Language/delete-lang/${languageId}`,

  // Manual Translation Endpoints
  getProductTranslations: (storeLanguageId: string) =>
    `Translation/get-by-store-language/${storeLanguageId}`,
  addProductTranslation: "TranslationManual/add-product-translation",
  updateProductTranslation: (translationId: string) =>
    `Translation/update/${translationId}`,
  deleteProductTranslation: (translationId: string) =>
    `Translation/delete/${translationId}`,
  getProductsWithTranslation: (storeId: string, langId: string) =>
    `TranslationManual/get-all-products-translation/${storeId}/${langId}`,
};
