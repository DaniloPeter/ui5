sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/ui/model/json/JSONModel",
  ],
  (Controller, MessageToast) => {
    "use strict";
    return Controller.extend("ui5.testapp.controller.App", {
      onInit() {
        const oData = {
          editMode: true,
          data: {
            name: "pete",
          },
        };

        const oModel = new JSONModel(oData);
        this.getView().setModel(oModel, "task");
      },

      onHelloPressed() {
        MessageToast("hello");
      },
    });
  }
);
