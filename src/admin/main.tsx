import { createRoot } from "react-dom/client";
import Admin from "./Admin";
import "../index.css";

const container = document.getElementById("root");
if (container) createRoot(container).render(<Admin />);
