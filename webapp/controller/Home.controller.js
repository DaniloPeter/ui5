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

      onSearch(oEvent) {
        const oFilterBar = oEvent.getSource();
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
                debugger;
                break;
              }
            }
            aSelectedKeys = aSelectedKeys.filter((o) => o);

            const aFilters = aSelectedKeys.map(function (sSelectedKey) {
              let oFilter,
                sPath = oFilterGroupItem.getName(),
                oOperator = FilterOperator.Contains;

              // TODO: Не получается сделать фильтр по дате, дата в формате dd.mm.yyyy не воспринимается
              // TODO: как Date, и при .filter он видит строку вместо Data
              // если преобразовать в Date данные из oData то отображение в datepicker ломается
              // но фильтрация начинает работать
              // если менять значения, фильрация перестает работать опять

              // писать свою функцию фильтрации даты

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
                  debugger;
                  oOperator = FilterOperator.EQ;
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
        const test = oTable.getBinding("items");
        debugger;
        oTable.getBinding("items").filter(aTableFilters);
      },

      onReset(oEvent) {
        this.onClear(oEvent);
        this.onSearch(oEvent);
      },

      onDateChange(oEvent) {
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

      onTaskDateChange(oEvent) {
        const inputField = oEvent.getSource();
        const value = inputField.getValue();

        this._validateDate(value, inputField);

        const oColumnListItem = inputField.getParent();
        const oBindingContext = oColumnListItem.getBindingContext("task");

        const oStartDate = oColumnListItem.getCells()[3];
        const oEndDate = oColumnListItem.getCells()[4];

        if (oStartDate) {
          oStartDate.setValueState(sap.ui.core.ValueState.None);
        }
        if (oEndDate) {
          oEndDate.setValueState(sap.ui.core.ValueState.None);
        }
      },

      onTaskNameChange(oEvent) {
        const sNewTaskName = oEvent.getParameter("value");
        const oSource = oEvent.getSource();
        const oItem = oSource.getParent();
        const oContext = oItem.getBindingContext("task");

        if (sNewTaskName.trim() === "") {
          oSource.setValueState(sap.ui.core.ValueState.Error);
          oSource.setValueStateText("Название задания не может быть пустым.");
        } else {
          const oModel = this.getView().getModel("task");
          oModel.setProperty("taskName", sNewTaskName, oContext);
          oSource.setValueState(sap.ui.core.ValueState.None);
        }
      },

      onTaskTypeChange(oEvent) {
        const sSelectedTaskType = oEvent.getParameter("selectedItem")?.getKey();
        if (!sSelectedTaskType) {
          oEvent.getSource().setValueState(sap.ui.core.ValueState.Error);
          oEvent
            .getSource()
            .setValueStateText("Тип задания должен быть выбран.");
        } else {
          const oSource = oEvent.getSource();
          const oItem = oSource.getParent();
          const oContext = oItem.getBindingContext("task");

          const oModel = this.getView().getModel("task");
          oModel.setProperty("taskType", sSelectedTaskType, oContext);
          oSource.setValueState(sap.ui.core.ValueState.None);
        }
      },
      onResponsibleChange(oEvent) {
        const sNewResponsible = oEvent.getParameter("value");
        const oSource = oEvent.getSource();
        const oItem = oSource.getParent();
        const oContext = oItem.getBindingContext("task");

        if (sNewResponsible.trim() === "") {
          oSource.setValueState(sap.ui.core.ValueState.Error);
          oSource.setValueStateText("значение не может быть пустым.");
        } else {
          const oModel = this.getView().getModel("task");
          oModel.setProperty("responsible", sNewResponsible, oContext);
          oSource.setValueState(sap.ui.core.ValueState.None);
        }
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

        // const oColumnVisibilityModel =
        //   this.getView().getModel("columnVisibility");
        // console.log(oColumnVisibilityModel);
        // const oTable = Fragment.byId(
        //   this.createId("TaskList"),
        //   "taskListTable"
        // );

        // const aColumns = [
        //   { name: "taskName", header: "Название Задачи" },
        //   { name: "taskType", header: "Тип Задачи" },
        //   { name: "responsible", header: "Ответственный" },
        //   { name: "startDate", header: "Дата Начала" },
        //   { name: "endDate", header: "Дата Завершения" },
        // ];

        // const aTableColumns = oTable.getColumns();

        // console.log(aTableColumns);

        // aColumns.forEach(({ name, header }) => {
        //   console.log(name, header);
        // });
      },

      async onOpenResponsibleDialog(oEvent) {
        const oSource = oEvent.getSource();
        const oContext = oSource.getBindingContext("task");
        console.log(oContext);
        this._selectedItemContext = oContext;

        this.oResponsibleDialog ??= await this.loadFragment({
          name: "ui5.testapp.view.fragments.ResponsibleDialog",
        });
        this.oResponsibleDialog.open();
      },

      onResponsibleSelect(oEvent) {
        // TODO: Не обновляется диалогове окно при вызове другого
        // если вызвать 2 диалога и нажать 2 одинаковых значения, то нажатие игнорируется
        const oSelectedItem = oEvent.getParameter("listItem");
        const setSelectedResponsible = oSelectedItem.getTitle();
        console.log(setSelectedResponsible);
        console.log(this._selectedItemContext);

        if (this._selectedItemContext) {
          const oModel = this.getView().getModel("task");
          const oContextPath = this._selectedItemContext.getPath();
          oModel.setProperty(
            oContextPath + "/responsible",
            setSelectedResponsible
          );
        }
        this.onResponsibleCloseDialog();
      },

      onResponsibleCloseDialog() {
        this.byId("responsibleDialog").close();
      },

      onAddData() {
        const oModel = this.getView().getModel("data");
        debugger;
        const aData = oModel.getProperty("/tasks") || [];

        const newItem = {
          taskName: "",
          taskType: "0",
          responsible: "",
          startDate: this._getCurrentDate(),
          endDate: "",
        };

        aData.unshift(newItem);

        oModel.setProperty("/Tasks", aData);
      },

      _getCurrentDate() {
        const now = new Date();
        const day = String(now.getDate()).padStart(2, "0");
        const month = String(now.getMonth() + 1).padStart(2, "0");
        const year = now.getFullYear();

        return `${day}.${month}.${year}`;
      },

      // Footer

      onExport() {
        const oTable = Fragment.byId(
          this.createId("TaskList"),
          "taskListTable"
        );
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
          csv += `"${item.taskName}";"${item.taskType}";"${item.responsible}";"${item.startDate}";"${item.endDate}"\n`;
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
        // TODO: не подсвечивает ошибку коненой даты
        const oTable = Fragment.byId(
          this.createId("TaskList"),
          "taskListTable"
        );
        const aItems = oTable.getItems();
        let allValid = true;

        aItems.forEach((oItem) => {
          const oCells = oItem.getCells();

          const oTaskNameInput = oCells[0];
          const sTaskName = oTaskNameInput.getValue().trim();
          if (sTaskName === "") {
            oTaskNameInput.setValueState(sap.ui.core.ValueState.Error);
            oTaskNameInput.setValueStateText(
              "Название задания не может быть пустым."
            );
            allValid = false;
          } else {
            oTaskNameInput.setValueState(sap.ui.core.ValueState.None);
          }

          const oResponsibleInput = oCells[2].getItems()[0];
          const sResponsible = oResponsibleInput.getValue().trim();
          if (sResponsible === "") {
            oResponsibleInput.setValueState(sap.ui.core.ValueState.Error);
            oResponsibleInput.setValueStateText(
              "Ответственный не может быть пустым."
            );
            allValid = false;
          } else {
            oResponsibleInput.setValueState(sap.ui.core.ValueState.None);
          }

          const oStartDateInput = oCells[3];
          const sStartDate = oStartDateInput.getValue().trim();
          const isStartDateValid = this._validateDate(
            sStartDate,
            oStartDateInput
          );
          allValid = allValid && isStartDateValid;

          const oEndDateInput = oCells[4];
          const sEndDate = oEndDateInput.getValue().trim();
          const isEndDateValid = this._validateDate(sEndDate, oEndDateInput);
          allValid = allValid && isEndDateValid;

          const startDateValue = oStartDateInput.getValue();
          const endDateValue = oEndDateInput.getValue();

          const startDate = this._parseDate(startDateValue);
          const endDate = this._parseDate(endDateValue);

          if (
            startDate &&
            endDate &&
            (endDate.year < startDate.year ||
              (endDate.year === startDate.year &&
                endDate.month < startDate.month) ||
              (endDate.year === startDate.year &&
                endDate.month === startDate.month &&
                endDate.day < startDate.day))
          ) {
            oEndDateInput.setValueState(sap.ui.core.ValueState.Error);
            oStartDateInput.setValueState(sap.ui.core.ValueState.Error);
            oStartDateInput.setValueStateText(
              "Дата начала не может быть позже даты окончания"
            );
            allValid = false;
          } else {
            oEndDateInput.setValueState(sap.ui.core.ValueState.None);
            oStartDateInput.setValueState(sap.ui.core.ValueState.None);
          }
          if (!isEndDateValid) {
            oEndDateInput.setValueState(sap.ui.core.ValueState.Error);
          } else {
            oEndDateInput.setValueState(sap.ui.core.ValueState.None);
          }
        });

        if (!allValid) {
          MessageToast.show(
            "Пожалуйста, исправьте некорректные данные перед сохранением."
          );
          return;
        }

        const oModel = this.getView().getModel("data");
        oModel.setProperty("/editMode", !oModel.getProperty("/editMode"));
        MessageToast.show("Данные сохранены.");
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

      onEdit() {
        this.onRefresh();
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
