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

      // Filter

      async onOpenDialog() {
        // TODO: Как сделать один диалог на все вызовы
        this.oHelpDialog ??= await this.loadFragment({
          name: "ui5.testapp.view.fragments.HelpDialog",
        });
        this.oHelpDialog.open();
      },

      onItemSelect(oEvent) {
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
        const value = inputField.getValue();
        // this._validateDate(value, inputField);
        const oStartDate = Fragment.byId(this.createId("Filter"), "startDate");
        const oEndDate = Fragment.byId(this.createId("Filter"), "endDate");
        oStartDate.setValueState(sap.ui.core.ValueState.None);
        oEndDate.setValueState(sap.ui.core.ValueState.None);
      },

      _validateDate(value, inputField) {
        const datePattern = /^\d{2}\.\d{2}\.\d{4}$/;
        if (value && !datePattern.test(value)) {
          inputField.setValueState(sap.ui.core.ValueState.Error);
          inputField.setValueStateText("Некорректный формат даты.");
          return false;
        }

        if (value) {
          const [day, month, year] = value.split(".").map(Number);

          if (month < 1 || month > 12) {
            inputField.setValueState(sap.ui.core.ValueState.Error);
            inputField.setValueStateText("Месяц должен быть от 1 до 12.");
            return false;
          }

          const daysInMonth = [
            31,
            this._isLeapYear(year) ? 29 : 28,
            31,
            30,
            31,
            30,
            31,
            31,
            30,
            31,
            30,
            31,
          ];

          if (day < 1 || day > daysInMonth[month - 1]) {
            inputField.setValueState(sap.ui.core.ValueState.Error);
            inputField.setValueStateText(
              `Некорректный день для месяца ${month}.`
            );
            return false;
          }

          inputField.setValueState(sap.ui.core.ValueState.None);
          return true;
        }

        return true;
      },

      _isLeapYear(year) {
        return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
      },

      onClearFields() {
        const oInputField = Fragment.byId(
          this.createId("Filter"),
          "inputField"
        );
        const oStartDate = Fragment.byId(this.createId("Filter"), "startDate");
        const oEndDate = Fragment.byId(this.createId("Filter"), "endDate");
        const oTypeSelect = Fragment.byId(
          this.createId("Filter"),
          "typeSelect"
        );
        oInputField.setValue("");
        oStartDate.setValue("");
        oEndDate.setValue("");
        oTypeSelect.setSelectedKey("0");

        oInputField.setValueState(sap.ui.core.ValueState.None);
        oStartDate.setValueState(sap.ui.core.ValueState.None);
        oEndDate.setValueState(sap.ui.core.ValueState.None);
      },

      onApplyFilter() {
        const oInputField = Fragment.byId(
          this.createId("Filter"),
          "inputField"
        );
        const oStartDate = Fragment.byId(this.createId("Filter"), "startDate");
        const oEndDate = Fragment.byId(this.createId("Filter"), "endDate");
        const oTypeSelect = Fragment.byId(
          this.createId("Filter"),
          "typeSelect"
        );

        const isStartDateValid = this._validateDate(
          oStartDate.getValue(),
          oStartDate
        );
        const isEndDateValid = this._validateDate(
          oEndDate.getValue(),
          oEndDate
        );

        if (!isStartDateValid || !isEndDateValid) {
          MessageToast.show(
            "Пожалуйста, исправьте некорректные даты перед применением фильтров."
          );
          return;
        }

        const sResponsible = oInputField.getValue();
        const sStartDate = oStartDate.getValue();
        const sEndDate = oEndDate.getValue();
        const sTaskType = oTypeSelect.getSelectedKey();

        console.log("Responsible:", sResponsible);
        console.log(sStartDate);
        console.log("End Date:", sEndDate);
        console.log(sTaskType);

        const aFilter = [];

        if (sResponsible) {
          aFilter.push(
            new Filter("responsible", FilterOperator.Contains, sResponsible)
          );
        }

        if (sStartDate) {
          aFilter.push(
            new Filter("startDate", FilterOperator.Contains, sStartDate)
          );
        }

        if (sEndDate) {
          aFilter.push(
            new Filter("endDate", FilterOperator.Contains, sEndDate)
          );
        }

        if (sTaskType && sTaskType != "0") {
          aFilter.push(new Filter("taskType", FilterOperator.EQ, sTaskType));
        }

        const oTable = Fragment.byId(
          this.createId("TaskList"),
          "taskListTable"
        );
        const oBinding = oTable.getBinding("items");

        oBinding.filter(aFilter);
        console.log(aFilter);

        MessageToast.show("Фильтры применены.");
      },
      onRefresh() {
        this.onClearFields();
        const aFilter = [];
        const oTable = Fragment.byId(
          this.createId("TaskList"),
          "taskListTable"
        );
        const oBinding = oTable.getBinding("items");

        // Применяем фильтры
        oBinding.filter(aFilter);
        console.log(aFilter);
      },

      // TaskList

      onTaskDateChange(oEvent) {
        const inputField = oEvent.getSource();
        const value = inputField.getValue();
        this._validateDate(value, inputField);
        const oStartDate = Fragment.byId(
          this.createId("TaskList"),
          "startDate"
        );
        const oEndDate = Fragment.byId(this.createId("TaskList"), "endDate");
        oStartDate.setValueState(sap.ui.core.ValueState.None);
        oEndDate.setValueState(sap.ui.core.ValueState.None);
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
        MessageToast.show("save");
        const oModel = this.getView().getModel("data");
        oModel.setProperty("/editMode", !oModel.getProperty("/editMode"));
      },

      onEdit() {
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
