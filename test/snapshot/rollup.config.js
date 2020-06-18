import config from "../../rollup.config.js";

const [bindingConfig] = config;

bindingConfig.output.file = "./test/snapshot/fixtures/binding.js";

export default [bindingConfig];
