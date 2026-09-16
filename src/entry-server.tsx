import { renderToString } from "react-dom/server";
import App from "./App";

export const render = (route = "/") => renderToString(<App route={route} />);
