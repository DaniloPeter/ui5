sap.ui.define(
  ["sap/ui/core/mvc/Controller", "sap/m/MessageToast"],
  (Controller, MessageToast) => {
    "use strict";
    return Controller.extend("ui5.testapp.controller.Filter", {
      async onOpenDialog() {
        this.oDialog ??= await this.loadFragment({
          name: "ui5.testapp.view.HelpDialog",
        });
        this.oDialog.open();
      },
      onItemSelect(oEvent) {
        console.log("Item selected");
        const oSelectedItem = oEvent.getParameter("listItem");
        const sResponsible = oSelectedItem.getTitle();

        const oModel = this.getView().getModel("data");

        oModel.setProperty("/responsible", sResponsible);
        this.onCloseDialog();
      },

      onCloseDialog() {
        this.byId("helpDialog").close();
      },
    });
  }
);
