sap.ui.define(
  [
    "sap/ui/core/UIComponent",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/resource/ResourceModel",
  ],
  (UIComponent, JSONModel, ResourceModel) => {
    "use strict";

    return UIComponent.extend("ui5.testapp.Component", {
      metadata: {
        interfaces: ["sap.ui.core.IAsyncContentCreation"],
        manifest: "json",
      },

      init() {
        UIComponent.prototype.init.apply(this, arguments);

        const oData = {
          editMode: false,
          data: {
            name: "pete",
          },
          responsible: "",
          Task: [],
        };

        const oModel = new JSONModel(oData);
        this.setModel(oModel, "data");
      },
    });
  }
);
