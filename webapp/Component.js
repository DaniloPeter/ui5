sap.ui.define(
  ["sap/ui/core/UIComponent", "sap/ui/model/json/JSONModel"],
  (UIComponent, JSONModel) => {
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
          deleteMode: false,
          visible: {
            taskName: true,
            taskType: true,
            responsible: true,
            startDate: true,
            endDate: true,
          },
          responsible: "",
          startDate: "",
          endDate: "",
          taskType: "",
        };

        const oModel = new JSONModel(oData);
        this.setModel(oModel, "data");
        const oColumnVisibilityModel = new JSONModel(oData.visible);
        this.setModel(oColumnVisibilityModel, "columnVisibility");

        this.getRouter().initialize();
      },
    });
  }
);
