// Main Application Controller
const App = {
    currentView: 'dashboard',
    apiBase: 'http://localhost:3000/api',

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
    },

    // API Helper Methods
    async fetchAPI(endpoint, options = {}) {
        try {
            const response = await fetch(`${this.apiBase}${endpoint}`, {
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers
                },
                ...options
            });

            if (!response.ok) {
                throw new Error(`API Error: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('API Error:', error);
            this.showNotification('Error connecting to server', 'danger');
            throw error;
        }
    },

    showNotification(message, type = 'info') {
        // Simple notification system
        const notification = document.createElement('div');
        notification.className = `alert alert-${type}`;
        notification.textContent = message;
        notification.style.position = 'fixed';
        notification.style.top = '20px';
        notification.style.right = '20px';
        notification.style.zIndex = '10000';
        notification.style.minWidth = '300px';

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transition = 'opacity 0.3s';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    },

    // Modal Helper
    showModal(title, content, onSave) {
        const modalContainer = document.getElementById('modal-container');
        modalContainer.innerHTML = `
            <div class="modal-overlay">
                <div class="modal">
                    <div class="modal-header">
                        <h3 class="modal-title">${title}</h3>
                        <button class="modal-close" onclick="App.closeModal()">×</button>
                    </div>
                    <div class="modal-body">
                        ${content}
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-secondary" onclick="App.closeModal()">Cancel</button>
                        <button class="btn btn-primary" id="modal-save-btn">Save</button>
                    </div>
                </div>
            </div>
        `;

        document.getElementById('modal-save-btn').addEventListener('click', () => {
            if (onSave) onSave();
        });

        // Close on overlay click
        modalContainer.querySelector('.modal-overlay').addEventListener('click', (e) => {
            if (e.target.classList.contains('modal-overlay')) {
                this.closeModal();
            }
        });
    },

    closeModal() {
        document.getElementById('modal-container').innerHTML = '';
    },

    formatDate(date) {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    },

    formatDateTime(date) {
        return new Date(date).toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }
};

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});
