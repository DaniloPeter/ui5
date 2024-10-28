sap.ui.define(
  ["sap/ui/core/UIComponent", "sap/ui/model/json/JSONModel"],
  (UIComponent, JSONModel) => {
    "use strict";

    return UIComponent.extend("ui5.testapp.Component", {
      metadata: {
        interfaces: ["sap.ui.core.IAsyncContentCreation"],
        manifest: "json",
      },

      _parseDate(dateString) {
        const parts = dateString.split(".");
        return new Date(parts[2], parts[1] - 1, parts[0]);
      },

      init() {
        UIComponent.prototype.init.apply(this, arguments);

        const oData = {
          editMode: false,
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
          tasks: [
            {
              taskName: "Задача 1",
              taskType: 1,
              responsible: 1,
              startDate: "01.07.2024",
              endDate: "05.07.2024",
            },
            {
              taskName: "Задача 2",
              taskType: 2,
              responsible: 2,
              startDate: "06.07.2024",
              endDate: "10.07.2024",
            },
            {
              taskName: "Задача 3",
              taskType: 3,
              responsible: 5,
              startDate: "11.07.2024",
              endDate: "15.07.2024",
            },
            {
              taskName: "Задача 4",
              taskType: 4,
              responsible: 5,
              startDate: "16.07.2024",
              endDate: "20.07.2024",
            },
            {
              taskName: "Задача 5",
              taskType: 5,
              responsible: 3,
              startDate: "21.07.2024",
              endDate: "25.07.2024",
            },
            {
              taskName: "Задача 6",
              taskType: 3,
              responsible: 4,
              startDate: "26.07.2024",
              endDate: "30.07.2024",
            },
            {
              taskName: "Задача 7",
              taskType: 1,
              responsible: 2,
              startDate: "31.07.2024",
              endDate: "04.08.2024",
            },
            {
              taskName: "Задача 8",
              taskType: 5,
              responsible: 1,
              startDate: "05.08.2024",
              endDate: "09.08.2024",
            },
            {
              taskName: "Задача 9",
              taskType: 3,
              responsible: 5,
              startDate: "10.08.2024",
              endDate: "14.08.2024",
            },
            {
              taskName: "Задача 10",
              taskType: 4,
              responsible: 3,
              startDate: "15.08.2024",
              endDate: "19.08.2024",
            },
            {
              taskName: "Задача 11",
              taskType: 5,
              responsible: 2,
              startDate: "20.08.2024",
              endDate: "24.08.2024",
            },
            {
              taskName: "Задача 12",
              taskType: 3,
              responsible: 5,
              startDate: "25.08.2024",
              endDate: "29.08.2024",
            },
            {
              taskName: "Задача 13",
              taskType: 1,
              responsible: 4,
              startDate: "30.08.2024",
              endDate: "03.09.2024",
            },
            {
              taskName: "Задача 14",
              taskType: 4,
              responsible: 3,
              startDate: "04.09.2024",
              endDate: "08.09.2024",
            },
            {
              taskName: "Задача 15",
              taskType: 3,
              responsible: 5,
              startDate: "09.09.2024",
              endDate: "13.09.2024",
            },
          ],
        };

        oData.tasks = oData.tasks.map((task) => {
          return {
            ...task,
            startDate: this._parseDate(task.startDate),
            endDate: this._parseDate(task.endDate),
          };
        });

        const oModel = new JSONModel(oData);
        this.setModel(oModel, "data");
        const oColumnVisibilityModel = new JSONModel(oData.visible);
        this.setModel(oColumnVisibilityModel, "columnVisibility");

        this.getRouter().initialize();
      },

      // TODO: если преобразовать в дату, то фильтрация работает, если выбрать другую дату, то опять стриг
      _parseDate(dateString) {
        const parts = dateString.split(".");
        return new Date(parts[2], parts[1] - 1, parts[0]);
      },
    });
  }
);
