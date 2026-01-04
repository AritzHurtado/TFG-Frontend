import ReactDOM from 'react-dom/client';
import App from './App';
import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import "./assets/styles/index.scss";

ReactDOM.createRoot(document.getElementById('root')!).render(
    <MantineProvider>
        <Notifications position="bottom-left" limit={3} />
        <App />
    </MantineProvider>
);
