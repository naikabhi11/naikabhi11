// Core Utilities and Helpers
export const Core = {
    apiBase: 'http://localhost:3000/api',

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
        const notification = document.createElement('div');
        notification.className = `alert alert-${type}`;
        notification.innerHTML = `
            <div style="flex: 1;">${message}</div>
            <button onclick="this.parentElement.remove()" style="background:none; border:none; color:inherit; cursor:pointer; font-size:1.2rem; line-height:1; padding-left:12px;">×</button>
        `;
        notification.style.position = 'fixed';
        notification.style.bottom = '24px';
        notification.style.right = '24px';
        notification.style.zIndex = '10000';
        notification.style.minWidth = '320px';
        notification.style.backdropFilter = 'blur(20px)';
        notification.style.webkitBackdropFilter = 'blur(20px)';
        notification.style.boxShadow = 'var(--shadow-float)';
        notification.style.animation = 'modalAppear 0.4s var(--transition)';

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateY(10px)';
            notification.style.transition = 'all 0.4s var(--transition)';
            setTimeout(() => notification.remove(), 400);
        }, 4000);
    },

    showModal(title, content, onSave) {
        const modalContainer = document.getElementById('modal-container');
        modalContainer.innerHTML = `
            <div class="modal-overlay">
                <div class="modal">
                    <div class="modal-header">
                        <h3 class="modal-title">${title}</h3>
                        <button class="modal-close" id="modal-close-btn">×</button>
                    </div>
                    <div class="modal-body">
                        ${content}
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-secondary" id="modal-cancel-btn">Cancel</button>
                        <button class="btn btn-primary" id="modal-save-btn">Save</button>
                    </div>
                </div>
            </div>
        `;

        document.getElementById('modal-save-btn').addEventListener('click', () => {
            if (onSave) onSave();
        });

        document.getElementById('modal-close-btn').addEventListener('click', () => this.closeModal());
        document.getElementById('modal-cancel-btn').addEventListener('click', () => this.closeModal());

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
        if (!date) return 'N/A';
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    },

    formatDateTime(date) {
        if (!date) return 'N/A';
        return new Date(date).toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }
};
