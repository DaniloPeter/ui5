sap.ui.define(["sap/ui/core/util/MockServer"], (MockServer) => {
  "use strict";

  return {
    init() {
      const sEntityName = "Employees";

      const oMockServer = new MockServer({
        rootUri:
          sap.ui.require.toUrl("ui5/testapp") + "/V2/Northwind/Northwind.svc/",
      });

      const oUrlParams = new URLSearchParams(window.location.search);

      MockServer.config({
        autoRespond: true,
        autoRespondAfter: oUrlParams.get("serverDelay") || 500,
      });

      const sPath = sap.ui.require.toUrl("ui5/testapp/localService");
      oMockServer.simulate(sPath + "/metadata.xml", sPath + "/mockdata");

      oMockServer.attachAfter(
        "POST",
        function (oEvent) {
          const { oXhr, oEntity } = oEvent.getParameters();

          try {
            const aEmployees = oMockServer.getEntitySetData("Employees");
            debugger;
            const iNewId = aEmployees.length
              ? Math.max(...aEmployees.map((emp) => emp.EmployeeID)) + 1
              : 1;
            const oNewEmployee = { ...oEntity, EmployeeID: iNewId };

            aEmployees.push(oNewEmployee);
            oMockServer.sEntitySetData("Employees", aEmployees);

            oXhr.respondJSON(
              201,
              {
                "Content-Type": "application/json",
              },
              JSON.stringify(oNewEmployee)
            );
          } catch (e) {
            console.error("Error while creating new employee:", e);
            oXhr.respondJSON(400, {}, JSON.stringify({ e: e.message }));
          }
        },
        "Employee"
      );

      oMockServer.start();
    },
  };
});
