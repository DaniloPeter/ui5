sap.ui.define([], function () {
  "use strict";

  return {
    formatDate(date) {
      debugger;
      if (!date) return "";
      const options = { day: "2-digit", month: "2-digit", year: "numeric" };
      return date.toLocaleDateString("ru-RU", options);
    },
  };
});
