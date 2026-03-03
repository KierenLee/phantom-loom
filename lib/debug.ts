import qs from "querystring";

export const isDebug = () =>
  !!qs.parse(window.location.search.replace("?", "")).is_debug;
