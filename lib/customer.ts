import { bindings as b } from "./multishipping";
const { bind } = b;

const pageTest = () => window.location.pathname.includes("/customer/address");

export const bindings = { bind, pageTest };
