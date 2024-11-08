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

      oMockServer.start();
    },
  };
});
