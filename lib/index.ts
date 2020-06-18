import { setup } from "@ideal-postcodes/jsutil";

import { bindings as shipping } from "./shipping";
import { bindings as billing } from "./billing";
import { bindings as multiAndCustomer } from "./multishipping-and-customer";

setup({ bindings: [shipping, billing, multiAndCustomer], window });
