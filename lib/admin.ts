import { config } from "@ideal-postcodes/jsutil";
import { Config } from "./extension";

import { bind as orders } from "./admin-orders";
import { bind as ordersEdit } from "./admin-orders-edit";
import { bind as customers } from "./admin-customers";
import { bind as custom } from "./admin-custom";

window.idpcStart = () =>
  [orders, customers, ordersEdit, custom].forEach((bind) => {
    const conf = config();
    if (conf) bind(conf as Config);
  });
