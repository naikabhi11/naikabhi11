import { Dashboard } from './components/dashboard.js';
import { RawMaterials } from './components/rawMaterials.js';
import { Processes } from './components/processes.js';
import { Production } from './components/production.js';
import { FinishedProducts } from './components/finishedProducts.js';
import { Quality } from './components/quality.js';
import { Reports } from './components/reports.js';

// Main Application Controller
export const App = {
    currentView: 'dashboard',

    init() {
        this.setupNavigation();
        this.loadView('dashboard');
    },

    setupNavigation() {
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                const view = item.dataset.view;
                this.loadView(view);

                // Update active state
                navItems.forEach(nav => nav.classList.remove('active'));
                item.classList.add('active');
            });
        });
    },

    loadView(viewName) {
        this.currentView = viewName;
        const viewContainer = document.getElementById('app-view');

        switch (viewName) {
            case 'dashboard':
                Dashboard.render(viewContainer);
                break;
            case 'raw-materials':
                RawMaterials.render(viewContainer);
                break;
            case 'processes':
                Processes.render(viewContainer);
                break;
            case 'production':
                Production.render(viewContainer);
                break;
            case 'finished-products':
                FinishedProducts.render(viewContainer);
                break;
            case 'quality':
                Quality.render(viewContainer);
                break;
            case 'reports':
                Reports.render(viewContainer);
                break;
        }
    }
};

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});
