sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/core/Fragment",
  ],
  (Controller, MessageToast, Filter, FilterOperator) => {
    "use strict";
    return Controller.extend("ui5.testapp.controller.Home", {
      oHelpDialog: null,
      oResponsibleDialog: null,

      onInit() {
        // TODO: не работает localstorage
        debugger;
        const oTaskModel = this.getOwnerComponent().getModel("employee");
        const sTaskLocalStorage = window.localStorage.getItem("EMPLOYEE");
        if (sTaskLocalStorage) {
          try {
            const aTaskLocalStorage = JSON.parse(sTaskLocalStorage);

            oTaskModel.setProperty("employee", aTaskLocalStorage);
          } catch (e) {
            console.log(e);
          }
        }
      },

      // Filter

      onClear() {
        this.byId("LastNameField").setValue();
        this.byId("FirstNameField").setValue();
        this.byId("TitleField").setValue();
        this.byId("startDate").setValue();
        this.byId("startDate").setMinDate();
        this.byId("endDate").setValue();
        this.byId("endDate").setMaxDate();
      },

      onSearch() {
        const oFilterBar = this.byId("filterBar");
        const oTable = this.byId("taskListTable");
        const aTableFilters = oFilterBar
          .getFilterGroupItems()
          .reduce(function (aResult, oFilterGroupItem) {
            const oControl = oFilterGroupItem.getControl();
            const sControlName = oControl.getMetadata().getName();
            let aSelectedKeys = [];
            switch (sControlName) {
              case "sap.m.Input": {
                aSelectedKeys = [oControl.getValue()];
                break;
              }
              case "sap.m.Select": {
                if (oControl.getSelectedKey() !== "0")
                  aSelectedKeys = [oControl.getSelectedKey()];
                break;
              }
              case "sap.m.DatePicker": {
                aSelectedKeys = [oControl.getDateValue()];
                break;
              }
            }
            aSelectedKeys = aSelectedKeys.filter((o) => o);

            const aFilters = aSelectedKeys.map(function (sSelectedKey) {
              let oFilter,
                sPath = oFilterGroupItem.getName(),
                oOperator = FilterOperator.Contains;

              switch (sControlName) {
                case "sap.m.Input": {
                  oOperator = FilterOperator.Contains;
                  break;
                }
                case "sap.m.Select": {
                  oOperator = FilterOperator.EQ;
                  break;
                }
                case "sap.m.DatePicker": {
                  oOperator = FilterOperator.LE;
                  break;
                }
              }

              oFilter = new Filter({
                path: sPath,
                operator: oOperator,
                value1: sSelectedKey,
              });
              return oFilter;
            });

            if (aSelectedKeys.length > 0) {
              aResult.push(
                new Filter({
                  filters: aFilters,
                  and: false,
                })
              );
            }

            return aResult;
          }, []);

        oTable.getBinding("items").filter(aTableFilters);
      },

      onReset() {
        this.onClear();
        this.onSearch();
      },

      onDateChange(oEvent) {
        debugger;
        const datePicker = oEvent.getSource();
        const datePickerParent = datePicker.getParent().getMetadata().getName();
        switch (datePickerParent) {
          case "sap.ui.comp.filterbar.FilterGroupItem": {
            const datePickerId = datePicker.getId().includes("startDate")
              ? "startDate"
              : "endDate";
            const otherDatePickerId =
              datePickerId === "startDate" ? "endDate" : "startDate";
            const oDate = datePicker.getDateValue();
            const oOtherDate = this.byId(otherDatePickerId);
            if (oDate) {
              switch (otherDatePickerId) {
                case "endDate": {
                  oOtherDate.setMinDate(oDate);
                  break;
                }
                case "startDate": {
                  oOtherDate.setMaxDate(oDate);
                  break;
                }
              }
            }
            break;
          }
          case "sap.m.ColumnListItem": {
            const datePickerId = datePicker.getId().includes("startDate")
              ? "startDate"
              : "endDate";
            const otherDatePickerId =
              datePickerId === "startDate" ? "endDate" : "startDate";

            const aDatePickerCells = datePicker.getParent().getCells();

            const sDateSId = aDatePickerCells
              .filter((cell) => cell.sId.includes(otherDatePickerId))
              .map((e) => e.sId)
              .join("");
            const oDate = datePicker.getDateValue();
            const oOtherDate = this.byId(sDateSId);
            if (oDate) {
              switch (otherDatePickerId) {
                case "endDate": {
                  oOtherDate.setMinDate(oDate);
                  break;
                }
                case "startDate": {
                  oOtherDate.setMaxDate(oDate);
                  break;
                }
              }
            }
          }
        }
        this.onValidate(oEvent);
      },

      // TaskList

      onValidate(oEvent) {
        const oField = oEvent.getSource();
        const sFieldName = oField.getMetadata().getName();
        let sValue;
        debugger;
        if (sFieldName === "sap.m.Select") {
          sValue = oField.getSelectedKey();
        } else {
          sValue = oField.getValue();
        }

        if (
          sValue === undefined ||
          sValue === null ||
          sValue === "" ||
          sValue === "0"
        ) {
          debugger;
          oField.setValueState(sap.ui.core.ValueState.Error);
          oField.setValueStateText("Ошибка ввода");
        } else {
          debugger;
          oField.setValueState(sap.ui.core.ValueState.None);
        }
      },

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

      async onSettings() {
        console.log("async"),
          (this.oDialog ??= await this.loadFragment({
            name: "ui5.testapp.view.fragments.SettingsDialog",
          }));

        console.log("before open"), this.oDialog.open();
      },

      onSettingsDialogClose() {
        this.byId("settingsDialog").close();
      },

      onAddData() {
        const oModel = this.getView().getModel("employee");

        const newRecord = {
          LastName: "test1",
          FirstName: "test2",
          Title: "Sales Representative",
          BirthDate: new Date(),
          HireDate: new Date(),
        };

        oModel.create("/Employees", newRecord, {
          success: (oData) => {
            MessageToast.show("успешно");
          },
          error: (oError) => {
            MessageToast.show("Ошибка");
            console.error("Ошибка: ", oError);
          },
        });

        debugger;
      },

      _getCurrentDate() {
        const now = new Date();
        const day = String(now.getDate()).padStart(2, "0");
        const month = String(now.getMonth() + 1).padStart(2, "0");
        const year = now.getFullYear();

        return `${day}.${month}.${year}`;
      },

      // Footer

      formatDate(date) {
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();
        return `${day}.${month}.${year}`;
      },

      onExport() {
        const oTable = this.byId("taskListTable");
        const header = [];
        const aTableColumns = oTable.getColumns();
        aTableColumns.forEach((column) => {
          const sColumnName = column.getHeader().getText().trim();
          header.push(sColumnName);
        });
        const oBinding = oTable.getBinding("items");
        const aFilteredData = oBinding
          .getCurrentContexts()
          .map((ctx) => ctx.getObject());

        let csv = "\uFEFF";
        csv += header.join(";") + "\n";

        aFilteredData.forEach((item) => {
          const startDateStr = this.formatDate(item.startDate);
          const endDateStr = this.formatDate(item.endDate);
          csv += `"${item.taskName}";"${item.taskType.name}";"${item.responsible.name}";"${startDateStr}";"${endDateStr}"\n`;
        });

        const blob = new Blob([csv], { type: "text/csv" });
        const url = window.URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "exported_data.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      },

      onSave() {
        // TODO: тут записываются данные в localstorage
        const oTable = this.byId("taskListTable");
        if (this._validateAll()) {
          const oModel = this.getView().getModel("employee");
          const oData = oModel.oData;
          window.localStorage.setItem("EMPLOYEE", JSON.stringify(oData));
          MessageToast.show("Данные сохранены.");
        }
      },

      _parseDate(dateStr) {
        const parts = dateStr.split(".");
        if (parts.length !== 3) return null;
        return {
          day: parseInt(parts[0], 10),
          month: parseInt(parts[1], 10),
          year: parseInt(parts[2], 10),
        };
      },

      onEdit(oEvent) {
        this.onReset(oEvent);
        MessageToast.show("edit");
        const oModel = this.getView().getModel("data");
        oModel.setProperty("/editMode", !oModel.getProperty("/editMode"));

        const oColumnVisibilityModel =
          this.getView().getModel("columnVisibility");

        const oVisibleData = {
          taskName: true,
          taskType: true,
          responsible: true,
          startDate: true,
          endDate: true,
        };
        oColumnVisibilityModel.setData(oVisibleData);
      },
    });
  }
);
