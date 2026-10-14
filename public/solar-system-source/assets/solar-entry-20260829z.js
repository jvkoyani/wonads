import { R as React } from "./react-DTAd8d1R.js";
import { c as ReactDOM } from "./three-BTLxjwMN.js";
import RealSolarSystem from "./RealSolarSystem-B4HpLfNr.js?v=20260908-seo1";

const root = document.getElementById("root");

const navigateToService = (path) => {
  const parts = String(path || "").split("/").filter(Boolean);
  if (!parts.length) {
    window.parent.location.href = new URL("../index.html", window.location.href).href;
    return;
  }
  const slug = parts.at(-1);
  const destination = new URL("../services.html", window.location.href);
  destination.hash = slug;
  window.parent.location.href = destination.href;
};

if (root) {
  const app = React.createElement(
    React.Suspense,
    { fallback: null },
    React.createElement(
      "div",
      { className: "hero-space-canvas" },
      React.createElement(RealSolarSystem, { onSelect: navigateToService })
    )
  );

  ReactDOM.createRoot(root).render(app);
}
