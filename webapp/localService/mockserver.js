sap.ui.define(["sap/ui/core/util/MockServer"], (MockServer) => {
  "use strict";

  return {
    init() {
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

      oMockServer.attachAfter("POST", function (oEvent) {
        const oRequest = oEvent.getParameter("request");
        const sPath = oRequest.getPath();
        const oData = JSON.parse(oRequest.getBody());

        if (sPath.includes("/Employees")) {
          const aEmployees = oMockServer.getEntities("Employees");
          const iNewId = aEmployees.length
            ? aEmployees[aEmployees.length - 1].EmployeeID + 1
            : 1;
          oData.EmployeeID = iNewId;

          aEmployees.push(oData);

          oEvent.getParameter("response").respondJSON(201, {
            d: oData,
          });
        } else {
          oEvent.getParameter("response").respondJSON(404, {
            error: "Resource not found",
          });
        }
      });

      oMockServer.start();
    },
  };
});
