import { config } from "@ideal-postcodes/jsutil";

import { bind as shipping } from "./shipping";
import { bind as billing } from "./billing";
import { bind as customer } from "./customer";
import { bind as multishipping } from "./multishipping";
import { bind as custom } from "./custom";

window.idpcStart = () => {
  [shipping, billing, customer, multishipping, custom].forEach((bind) => {
    const conf = config();
    if (conf) bind(conf);
  });
};
