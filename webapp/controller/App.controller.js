sap.ui.define(
  ["sap/ui/core/mvc/Controller", "sap/m/MessageToast", l],
  (Controller, MessageToast) => {
    "use strict";
    return Controller.extend("ui5.testapp.controller.App", {
      onHelloPressed() {
        MessageToast.show("hello");
      },

      onEditMode() {
        const oModel = this.getView().getModel("task");
        oModel.setProperty("/editMode", !oModel.getProperty("/editMode"));
      },
    });
  }
);
