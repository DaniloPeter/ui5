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
    return Controller.extend("ui5.testapp.controller.Home", {
      oHelpDialog: null,
      oResponsibleDialog: null,

      onInit() {},

      // Filter

      onClear() {
        this.byId("taskNameField").setValue();
        this.byId("typeSelect").setSelectedKey();
        this.byId("responsibleSelect").setSelectedKey();
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
                  if (sPath === "typeSelect") sPath = "taskType/key";
                  if (sPath === "responsibleFilter") sPath = "responsible/key";

                  oOperator = FilterOperator.EQ;
                  break;
                }
                case "sap.m.DatePicker": {
                  if (sPath === "startDate") oOperator = FilterOperator.GE;
                  if (sPath === "endDate") oOperator = FilterOperator.LE;
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
      },

      // TaskList

      _onValidate() {
        const oTable = this.byId("taskListTable");
        const aItems = oTable.getItems();
        let allValid = true;

        // aItems.forEach((item) => {
        //   debugger;
        //   const taskName = item
        //     .getBindingContext("data")
        //     .getProperty("taskName");
        //   const startDate = item
        //     .getBindingContext("data")
        //     .getProperty("startDate");
        //   const endDate = item.getBindingContext("data").getProperty("endDate");

        //   if (!taskName) {
        //     // Если taskName пустое, подсветить его красным
        //     // Код для подсветки taskName красным
        //   }

        //   if (!startDate) {
        //     // Если startDate пустая, вызвать функцию onDateChange
        //     // Код для вызова функции onDateChange
        //     this.onDateChange(/* аргументы */);
        //   }

        //   if (!endDate) {
        //     // Если endDate пустая, подсветить его красным
        //     // Код для подсветки endDate красным
        //   }
        // });
        aItems.forEach((oItem) => {
          const oCells = oItem.getCells();

          oCells.forEach((oCell) => {
            debugger;
            const sCellType = oCell.getMetadata().getElementName();
            let sValue = "";
            switch (sCellType) {
              case "sap.m.Input": {
                sValue = oCell.getValue().trim();
                debugger;
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
              debugger;
              oCell.setValueState(sap.ui.core.ValueState.Error);
              oCell.setValueStateText("Ошибка ввода");
              allValid = false;
            } else {
              oCell.setValueState(sap.ui.core.ValueState.None);
            }
          });
          // const oTaskNameInput = oCells[0];
          // const sTaskName = oTaskNameInput.getValue().trim();
          // if (sTaskName === "") {
          //   oTaskNameInput.setValueState(sap.ui.core.ValueState.Error);
          //   oTaskNameInput.setValueStateText(
          //     "Название задания не может быть пустым."
          //   );
          //   allValid = false;
          // } else {
          //   oTaskNameInput.setValueState(sap.ui.core.ValueState.None);
          // }

          //   const oResponsibleInput = oCells[2].getItems()[0];
          //   const sResponsible = oResponsibleInput.getValue().trim();
          //   if (sResponsible === "") {
          //     oResponsibleInput.setValueState(sap.ui.core.ValueState.Error);
          //     oResponsibleInput.setValueStateText(
          //       "Ответственный не может быть пустым."
          //     );
          //     allValid = false;
          //   } else {
          //     oResponsibleInput.setValueState(sap.ui.core.ValueState.None);
          //   }

          //   const oStartDateInput = oCells[3];
          //   const sStartDate = oStartDateInput.getValue().trim();
          //   if (
          //     sStartDate === null ||
          //     sStartDate === undefined ||
          //     sStartDate === ""
          //   ) {
          //     oStartDateInput.setValueState(sap.ui.core.ValueState.Error);
          //     oStartDateInput.setValueStateText("Дата не может быть пустым.");
          //     allValid = false;
          //   }

          //   const oEndDateInput = oCells[4];
          //   const sEndDate = oEndDateInput.getValue().trim();

          //   if (sEndDate === null || sEndDate === undefined || sEndDate === "") {
          //     oEndDateInput.setValueState(sap.ui.core.ValueState.Error);
          //     oEndDateInput.setValueStateText("Дата не может быть пустым.");
          //     allValid = false;
          //   }
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
        const oModel = this.getView().getModel("data");
        const aData = oModel.getProperty("/tasks") || [];
        const newItem = {
          taskName: "",
          taskType: "0",
          responsible: "0",
          startDate: new Date(),
          endDate: null,
        };

        aData.unshift(newItem);

        oModel.setProperty("/tasks", aData);

        if (this._onValidate() === true) {
          MessageToast.show("validate true");
        }
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
        // TODO: доделать валидацию, на сохранении
        const oTable = this.byId("taskListTable");
        if (this._onValidate()) {
          const oModel = this.getView().getModel("data");
          oModel.setProperty("/editMode", !oModel.getProperty("/editMode"));
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
