/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import DashboardPage from './pages/DashboardPage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';

// --- MAIN APP COMPONENT ---
function App() {
    // Use hash-based routing. Read the path from the URL hash, remove the '#'.
    const [path, setPath] = useState(window.location.hash.slice(1));

    useEffect(() => {
        const onHashChange = () => {
            setPath(window.location.hash.slice(1));
        };

        window.addEventListener('hashchange', onHashChange);
        return () => {
            window.removeEventListener('hashchange', onHashChange);
        };
    }, []);

    const navigate = (newPath: string) => {
        // To navigate, we just update the hash.
        // The `hashchange` event listener will trigger the state update.
        window.location.hash = newPath;
    };

    let content;
    switch (path) {
        case 'dashboard':
            content = <DashboardPage user={{ email: 'ayush.dev@gmail.com' }} onNavigate={navigate} />;
            break;
        case 'signup':
            content = <SignUpPage onNavigate={navigate} />;
            break;
        default: // Default route is login page (when hash is empty or something else)
            content = <LoginPage onNavigate={navigate} />;
    }

    return content;
}

const container = document.getElementById('root');
if (container) {
    const root = createRoot(container);
    root.render(<App />);
}
