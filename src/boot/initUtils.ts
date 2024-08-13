import { boot } from "quasar/wrappers";
import { Utils } from "src/utils/utils";

export default boot(async ({ app }) => {
  app.config.globalProperties.$utils = new Utils("boot");
});
