sap.ui.define(
  ["sap/ui/core/mvc/Controller", "sap/ui/model/json/JSONModel"],
  function (Controller, JSONModel) {
    "use strict";

    return Controller.extend("your.namespace.ControllerName", {
      onInit: function () {
        var oData = {
          tasks: [
            {
              taskName: "Задача 2",
              taskType: "Тип 1",
              responsible: "Пользователь 1",
              startDate: "01.07.2024",
              endDate: "05.07.2024",
            },
            {
              taskName: "Задача 4",
              taskType: "Тип 1",
              responsible: "Пользователь 2",
              startDate: "01.07.2024",
              endDate: "05.07.2024",
            },
            {
              taskName: "Задача 3",
              taskType: "Тип 2",
              responsible: "Пользователь 1",
              startDate: "01.07.2024",
              endDate: "05.07.2024",
            },
            {
              taskName: "Задача 5",
              taskType: "Тип 3",
              responsible: "Пользователь 3",
              startDate: "01.07.2024",
              endDate: "05.07.2024",
            },
            {
              taskName: "Задача 9",
              taskType: "Тип 3",
              responsible: "Пользователь 3",
              startDate: "22.08.2024",
              endDate: "25.08.2024",
            },
          ],
        };

        var oModel = new JSONModel(oData);
        this.setModel(oModel, "task");
      },
    });
  }
);
