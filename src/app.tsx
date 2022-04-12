import * as React from "react";
import { createRoot } from "react-dom/client";
import { AppContextProvider } from "./appContext";
import Tabs from "./components/tabs";
import TitleBar from "./components/titlebar";
import Webviews from "./components/webviews";

function render() {
    const root = createRoot(document.getElementById("root"));
    root.render(
        <AppContextProvider>
            <TitleBar />
            <Tabs />
            <Webviews/>
        </AppContextProvider>
    );
}

render();
