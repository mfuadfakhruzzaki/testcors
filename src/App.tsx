import React from "react";
import AppRoutes from "./routes";
import { AuthProvider } from "./contexts/AuthProvider";

const App: React.FC = () => {
  return (
    <div>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </div>
  );
};

export default App;
