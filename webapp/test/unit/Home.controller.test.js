sap.ui.require(
  [
    "ui5/testapp/controller/Home.controller",
    "sap/m/Input",
    "sap/m/DatePicker",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
  ],
  function (
    HomeController,
    Input,
    DatePicker,
    JSONModel,
    Filter,
    FilterOperator
  ) {
    "use strict";

    if (!HomeController) {
      console.error("HomeController не загружен!");
      return;
    }

    QUnit.module("HomeController Tests");

    // Тест для onClear (оставляем без изменений)
    QUnit.test(
      "onClear should reset input fields and update model data",
      function (assert) {
        const done = assert.async();
        const oController = new HomeController();

        oController.byId = function (id) {
          switch (id) {
            case "LastNameField":
              return new Input({ value: "TestLastName" });
            case "FirstNameField":
              return new Input({ value: "TestFirstName" });
            case "TitleField":
              return new Input({ value: "TestTitle" });
            case "startDate":
              const startDate = new DatePicker();
              startDate.setDateValue(new Date(2023, 0, 1));
              return startDate;
            case "endDate":
              const endDate = new DatePicker();
              endDate.setDateValue(new Date(2023, 11, 31));
              return endDate;
          }
        };

        const oMockModel = new JSONModel({
          testValue: "TestValue",
          startDate: new Date(2023, 0, 1),
          endDate: new Date(2023, 11, 31),
        });

        oController.getView = function () {
          return {
            setModel: function () {},
            getModel: function (modelName) {
              if (modelName === "data") {
                return oMockModel;
              }
            },
          };
        };

        oController.onClear();

        setTimeout(() => {
          assert.strictEqual(
            oController.byId("LastNameField").getValue(),
            "",
            "Поле LastName очищено"
          );
          assert.strictEqual(
            oController.byId("FirstNameField").getValue(),
            "",
            "Поле FirstName очищено"
          );
          assert.strictEqual(
            oController.byId("TitleField").getValue(),
            "",
            "Поле Title очищено"
          );
          assert.strictEqual(
            oController.byId("startDate").getDateValue(),
            null,
            "Поле startDate очищено"
          );
          assert.strictEqual(
            oController.byId("endDate").getDateValue(),
            null,
            "Поле endDate очищено"
          );

          assert.strictEqual(
            oMockModel.getProperty("/testValue"),
            "",
            "Значение testValue в модели очищено"
          );
          assert.strictEqual(
            oMockModel.getProperty("/startDate"),
            null,
            "Значение startDate в модели очищено"
          );
          assert.strictEqual(
            oMockModel.getProperty("/endDate"),
            null,
            "Значение endDate в модели очищено"
          );

          done();
        }, 0);
      }
    );

    // Тест для onSearch
    QUnit.test("onSearch should apply filters to the table", function (assert) {
      const done = assert.async();
      const oController = new HomeController();

      // Эмулируем FilterBar и TaskListTable
      oController.byId = function (id) {
        switch (id) {
          case "filterBar":
            return {
              getFilterGroupItems: function () {
                return [
                  {
                    getName: function () {
                      return "LastName";
                    },
                    getControl: function () {
                      return new Input({ value: "Doe" });
                    },
                  },
                  {
                    getName: function () {
                      return "StartDate";
                    },
                    getControl: function () {
                      const datePicker = new DatePicker();
                      datePicker.setDateValue(new Date(2023, 0, 1));
                      return datePicker;
                    },
                  },
                ];
              },
            };
          case "taskListTable":
            return {
              getBinding: function () {
                return {
                  filter: function (filters) {
                    assert.ok(filters.length > 0, "Фильтры применены");
                    assert.strictEqual(
                      filters[0].aFilters[0].sPath,
                      "LastName",
                      "Фильтр LastName применен"
                    );
                    assert.strictEqual(
                      filters[0].aFilters[0].oValue1,
                      "Doe",
                      "Значение фильтра LastName корректно"
                    );
                    assert.strictEqual(
                      filters[1].aFilters[0].sPath,
                      "StartDate",
                      "Фильтр StartDate применен"
                    );
                    assert.strictEqual(
                      filters[1].aFilters[0].oValue1
                        .toISOString()
                        .substring(0, 10),
                      "2023-01-01",
                      "Значение фильтра StartDate корректно"
                    );
                    done();
                  },
                };
              },
            };
        }
      };

      oController.onSearch();
    });
  }
);
