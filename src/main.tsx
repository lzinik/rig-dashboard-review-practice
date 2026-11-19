import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './store';
import { SettingsProvider } from './context/SettingsContext';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <SettingsProvider>
        <App />
      </SettingsProvider>
    </Provider>
  </React.StrictMode>
);
