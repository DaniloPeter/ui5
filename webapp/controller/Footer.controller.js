sap.ui.define(
  ["sap/ui/core/mvc/Controller", "sap/m/MessageToast"],
  (Controller, MessageToast) => {
    "use strict";
    return Controller.extend("ui5.testapp.controller.Footer", {
      onExport() {
        MessageToast.show("export");
      },
      onSave() {
        MessageToast.show("save");
        const oModel = this.getView().getModel("data");
        oModel.setProperty("/editMode", !oModel.getProperty("/editMode"));
      },
      onEdit() {
        MessageToast.show("edit");
        const oModel = this.getView().getModel("data");
        oModel.setProperty("/editMode", !oModel.getProperty("/editMode"));
      },
    });
  }
);
