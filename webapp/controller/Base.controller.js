sap.ui.define(["sap/ui/core/mvc/Controller"], (Controller) => {
  "use strict";
  return Controller.extend("ui5.testapp.controller.Base", {
    onCloseDialog() {
      this.byId("helpDialog").close();
    },
  });
});
