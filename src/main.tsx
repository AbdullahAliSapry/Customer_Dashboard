import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import './i18n/i18n';
import { UserProvider } from './pages/loyaltyPoints/context/UserContext.tsx';
import { Toaster } from 'react-hot-toast';
import { store } from './Store/Store.ts';
import { Provider } from 'react-redux';
createRoot(document.getElementById('root')!).render(
  <>
    <UserProvider >
      <Provider store={store}>
       <App />
      </Provider>
      <Toaster position='top-right'/>
    </UserProvider>
  </>
);