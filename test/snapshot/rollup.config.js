import config from "../../rollup.config.js";

const [storeConfig, adminConfig] = config;

storeConfig.output.file = "./test/snapshot/fixtures/store.js";
adminConfig.output.file = "./test/snapshot/fixtures/admin.js";

export default [storeConfig, adminConfig];
