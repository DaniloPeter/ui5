sap.ui.define(["sap/ui/core/UIComponent", "sap/ui"], (UIComponent) => {
  "use strict";

  return UIComponent.extend("ui5.testapp.Component", {
    metadata: {
      interfaces: ["sap.ui.core.IAsyncContentCreation"],
      rootView: {
        viewName: "ui5.testapp.view.App",
        type: "XML",
        id: "app",
      },
    },

    init() {
      UIComponent.prototype.init.apply(this, arguments);

      const oData = {
        editMode: true,
        data: {
          name: "pete",
        },
      };

      const oModel = new JSONModel(oData);
      this.getView().setModel(oModel, "task");
    },
  });
});
