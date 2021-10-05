import { config } from "@ideal-postcodes/jsutil";

import { bind as shipping } from "./shipping";
import { bind as billing } from "./billing";
import { bind as customer } from "./customer";
import { bind as multishipping } from "./multishipping";

window.idpcStart = () => {
  [shipping, billing, customer, multishipping].forEach((bind) => {
    const conf = config();
    if (conf) bind(conf);
  });
};
