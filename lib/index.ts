import { setup } from "@ideal-postcodes/jsutil";

import { bindings as shipping } from "./shipping";
import { bindings as billing } from "./billing";
import { bindings as customer } from "./customer";
import { bindings as multishipping } from "./multishipping";
import { bindings as adminOrders } from "./admin-orders";
import { bindings as adminCustomers } from "./admin-customers";

setup({
  bindings: [
    shipping,
    billing,
    customer,
    multishipping,
    adminOrders,
    adminCustomers
  ],
  window
});
