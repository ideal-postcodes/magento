import { config } from "@ideal-postcodes/jsutil";

import { bind as orders } from "./admin-orders";
import { bind as ordersEdit } from "./admin-orders-edit";
import { bind as customers } from "./admin-customers";

window.idpcStart = () =>
  [orders, customers, ordersEdit].forEach((bind) => {
    const conf = config();
    if (conf) bind(conf);
  });
