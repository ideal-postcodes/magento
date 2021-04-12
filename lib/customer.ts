import { bindings as b } from "./multishipping";
import { includes } from "./extension";
const { bind } = b;

const pageTest = () => includes(window.location.pathname, "/customer/address");

export const bindings = { bind, pageTest };
