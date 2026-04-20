
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const GlobalErrorLogger = () => {
  React.useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      console.error("Global Error Caught:", event.error);
    };
    const handleRejection = (event: PromiseRejectionEvent) => {
      console.error("Unhandled Rejection:", event.reason);
    };
    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleRejection);
    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleRejection);
    }
  }, []);
  return null;
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <GlobalErrorLogger />
    <App />
  </React.StrictMode>
);
