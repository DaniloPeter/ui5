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
      // Filter

      async onOpenDialog() {
        this.oDialog ??= await this.loadFragment({
          name: "ui5.testapp.view.fragments.HelpDialog",
        });
        this.oDialog.open();
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
        this._validateDate(value, inputField);
      },
      _validateDate(value, inputField) {
        const datePattern = /^\d{2}\.\d{2}\.\d{4}$/; // Паттерн для проверки формата
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
          return true; // Дата валидна
        }

        return true; // Если поле пустое, считать валидным
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
        // Получаем ссылки на элементы фильтров
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
          return; // Выходим, если даты не валидны
        }

        // Извлекаем значения
        const sResponsible = oInputField.getValue();
        const sStartDate = oStartDate.getValue();
        const sEndDate = oEndDate.getValue();
        const sTaskType = oTypeSelect.getSelectedKey();

        console.log("Responsible:", sResponsible);
        console.log(sStartDate);
        console.log("End Date:", sEndDate);
        console.log(sTaskType);

        // Создаём массив фильтров
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

      // Footer

      onExport() {
        MessageToast.show("export");
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
      },
    });
  }
);
