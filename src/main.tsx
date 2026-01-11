import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

const rootElement = document.getElementById("root");

if (!rootElement) {
  console.error("Root element not found");
} else {
  try {
    const root = createRoot(rootElement);
    root.render(<App />);
  } catch (error) {
    console.error("Failed to render app:", error);
    rootElement.innerHTML = `
      <div style="padding: 20px; font-family: Arial, sans-serif; color: red;">
        <h2>Application Error</h2>
        <p>Failed to load the application. Please check the console for more details.</p>
        <p>Error: ${error instanceof Error ? error.message : 'Unknown error'}</p>
      </div>
    `;
  }
}
