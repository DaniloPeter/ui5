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

        // Получаем таблицу и модель
        const oTable = Fragment.byId(
          this.createId("TaskList"),
          "taskListTable"
        );
        const oBinding = oTable.getBinding("items");

        // Применяем фильтры
        oBinding.filter(aFilter);
        console.log(aFilter);

        // Сообщаем о применении фильтров (по желанию)
        if (aFilter.length > 0) {
          MessageToast.show("Фильтры применены.");
        } else {
          MessageToast.show("Фильтры очищены.");
        }
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
