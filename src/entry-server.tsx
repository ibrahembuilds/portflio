import { renderToString } from "react-dom/server";
import App from "./App";
import type { Locale } from "./App";

export const render = (locale: Locale = "en") => renderToString(<App locale={locale} />);
