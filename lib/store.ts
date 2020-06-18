import { setup } from "@ideal-postcodes/jsutil";

import { bindings as shipping } from "./shipping";
import { bindings as billing } from "./billing";
import { bindings as customer } from "./customer";
import { bindings as multishipping } from "./multishipping";

window.idpcStart = () =>
  setup({
    bindings: [shipping, billing, customer, multishipping],
    window
  });
