// Quality Control Component
const Quality = {
    qualityChecks: [],
    wipItems: [],
    finishedProducts: [],

    async render(container) {
        container.innerHTML = `
            <div class="page-header">
                <h2>Quality Control</h2>
                <p>Track quality inspections and maintain standards</p>
            </div>
            
            <div class="card">
                <div class="card-header">
                    <h3 class="card-title">Quality Inspections</h3>
                    <button class="btn btn-primary" onclick="Quality.showAddModal()">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="12" y1="5" x2="12" y2="19"></line>
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                        </svg>
                        Record Inspection
                    </button>
                </div>
                <div id="quality-list">
                    <div class="spinner"></div>
                </div>
            </div>
        `;

        await this.loadData();
        this.renderList();
    },

    async loadData() {
        try {
            [this.qualityChecks, this.wipItems, this.finishedProducts] = await Promise.all([
                App.fetchAPI('/quality-checks'),
                App.fetchAPI('/wip'),
                App.fetchAPI('/finished-products')
            ]);
        } catch (error) {
            console.error('Error loading quality data:', error);
        }
    },

    renderList() {
        const listContainer = document.getElementById('quality-list');

        if (this.qualityChecks.length === 0) {
            listContainer.innerHTML = `
                <div class="empty-state">
                    <h3>No Quality Checks</h3>
                    <p>Record your first quality inspection</p>
                </div>
            `;
            return;
        }

        listContainer.innerHTML = `
            <div class="table-container">
                <table class="table">
                    <thead>
                        <tr>
                            <th>Item Reference</th>
                            <th>Inspector</th>
                            <th>Date & Time</th>
                            <th>Parameters</th>
                            <th>Status</th>
                            <th>Remarks</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${this.qualityChecks.map(check => this.renderCheckRow(check)).join('')}
                    </tbody>
                </table>
            </div>
        `;
    },

    renderCheckRow(check) {
        const statusBadge = check.status === 'pass'
            ? '<span class="badge badge-success">Pass</span>'
            : '<span class="badge badge-danger">Fail</span>';

        const inspectionDate = App.formatDateTime(check.inspectionDate);

        return `
            <tr>
                <td><strong style="color: var(--text-primary);">${check.itemReference || 'N/A'}</strong></td>
                <td><span style="font-size: 0.85rem;">${check.inspector || 'Unknown'}</span></td>
                <td><span style="font-size: 0.8rem; color: var(--text-tertiary);">${inspectionDate}</span></td>
                <td><span style="font-size: 0.85rem;">${check.parameters || 'Standard'}</span></td>
                <td>${statusBadge}</td>
                <td><span style="font-size: 0.85rem; opacity: 0.8;">${check.remarks || '—'}</span></td>
            </tr>
        `;
    },

    showAddModal() {
        const content = `
            <form id="quality-form">
                <div class="form-group">
                    <label class="form-label">Item Reference</label>
                    <input type="text" class="form-input" id="quality-item" required placeholder="Batch number or SKU">
                </div>
                
                <div class="form-group">
                    <label class="form-label">Inspector Name</label>
                    <input type="text" class="form-input" id="quality-inspector" required placeholder="Full Name">
                </div>
                
                <div class="form-group">
                    <label class="form-label">Parameters Checked</label>
                    <input type="text" class="form-input" id="quality-parameters" placeholder="e.g. Dimensions, Finish, Hardness">
                </div>
                
                <div class="form-group">
                    <label class="form-label">Test Results</label>
                    <textarea class="form-textarea" id="quality-results" placeholder="Detailed measurements..." style="min-height: 80px;"></textarea>
                </div>
                
                <div class="form-group">
                    <label class="form-label">Inspection Status</label>
                    <select class="form-select" id="quality-status" required>
                        <option value="pass">Pass</option>
                        <option value="fail">Fail</option>
                    </select>
                </div>
                
                <div class="form-group">
                    <label class="form-label">Remarks</label>
                    <textarea class="form-textarea" id="quality-remarks" placeholder="Additional notes..." style="min-height: 80px;"></textarea>
                </div>
            </form>
        `;

        App.showModal('Record Quality Inspection', content, () => this.saveCheck());
    },

    async saveCheck() {
        const data = {
            itemReference: document.getElementById('quality-item').value,
            inspector: document.getElementById('quality-inspector').value,
            parameters: document.getElementById('quality-parameters').value,
            results: document.getElementById('quality-results').value,
            status: document.getElementById('quality-status').value,
            remarks: document.getElementById('quality-remarks').value
        };

        try {
            await App.fetchAPI('/quality-checks', {
                method: 'POST',
                body: JSON.stringify(data)
            });

            App.showNotification('Quality check recorded successfully', 'info');
            App.closeModal();
            await this.loadData();
            this.renderList();
        } catch (error) {
            App.showNotification('Error recording quality check', 'danger');
        }
    }
};
