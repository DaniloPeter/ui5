sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/core/Fragment",
  ],
  (Controller, MessageToast, Filter, FilterOperator, Fragment) => {
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
      onDateChange(oEvent) {
        const inputField = oEvent.getSource();
        let value = inputField.getValue();

        value = value.replace(/[^\d.]/g, "");

        if (value.length >= 2 && value.length < 3) {
          value = value.slice(0, 2) + ".";
        }
        if (value.length >= 5 && value.length < 6) {
          value = value.slice(0, 5) + ".";
        }
        if (value.length >= 10) {
          value = value.slice(0, 10);
        }

        inputField.setValue(value);
      },

      onClearFields() {
        const oInputField = this.getView().byId("inputField");
        const oStartDate = this.getView().byId("startDate");
        const oEndDate = this.getView().byId("endDate");
        const oTypeSelect = this.getView().byId("typeSelect");

        oInputField.setValue("");
        oStartDate.setValue("");
        oEndDate.setValue("");
        oTypeSelect.setSelectedKey("0");
      },

      onApplyFilter() {
        // TODO: taskList binding
        const oTaskList0 = this.byId("taskList");

        console.log(oTaskList0);
      },

      onRefresh() {
        this.onClearFields();
      },
    });
  }
);
