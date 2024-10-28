sap.ui.define(["sap/ui/core/mvc/Controller"], (Controller) => {
  "use strict";
  return Controller.extend("ui5.testapp.controller.Base", {
    _validateAll() {
      const oTable = this.byId("taskListTable");
      const aItems = oTable.getItems();
      let allValid = true;

      aItems.forEach((oItem) => {
        const oCells = oItem.getCells();

        oCells.forEach((oCell) => {
          const sCellType = oCell.getMetadata().getElementName();
          let sValue = "";
          switch (sCellType) {
            case "sap.m.Input": {
              sValue = oCell.getValue().trim();
              break;
            }
            case "sap.m.Select": {
              sValue = oCell.getSelectedKey().trim();
              break;
            }
            case "sap.m.DatePicker": {
              sValue = oCell.getDateValue();
              break;
            }
          }
          if (
            sValue === "" ||
            sValue === undefined ||
            sValue === null ||
            sValue === "0"
          ) {
            oCell.setValueState(sap.ui.core.ValueState.Error);
            console.log(oCell.getMetadata());
            oCell.setValueStateText("Ошибка ввода");
            allValid = false;
          } else {
            oCell.setValueState(sap.ui.core.ValueState.None);
          }
        });
      });
      return allValid;
    },
  });
});
