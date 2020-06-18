import { setup } from "@ideal-postcodes/jsutil";

import { bindings as orders } from "./admin-orders";
import { bindings as ordersEdit } from "./admin-orders-edit";
import { bindings as customers } from "./admin-customers";

window.idpcStart = () =>
  setup({
    bindings: [orders, customers, ordersEdit],
    window
  });
