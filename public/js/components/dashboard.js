// Dashboard Component
const Dashboard = {
    data: {
        stats: null,
        production: null,
        inventory: null
    },

    async render(container) {
        container.innerHTML = `
            <div class="page-header">
                <h2>Dashboard</h2>
                <p>Real-time overview of manufacturing operations</p>
            </div>
            
            <div id="dashboard-stats" class="stats-grid">
                <div class="spinner"></div>
            </div>
            
            <div class="card">
                <div class="card-header">
                    <h3 class="card-title">Manufacturing Pipeline</h3>
                </div>
                <div id="pipeline-content">
                    <div class="spinner"></div>
                </div>
            </div>
            
            <div class="card">
                <div class="card-header">
                    <h3 class="card-title">Alerts & Notifications</h3>
                </div>
                <div id="alerts-content">
                    <div class="spinner"></div>
                </div>
            </div>
        `;

        await this.loadData();
        this.renderStats();
        this.renderPipeline();
        this.renderAlerts();
    },

    async loadData() {
        try {
            [this.data.stats, this.data.production, this.data.inventory] = await Promise.all([
                App.fetchAPI('/analytics/dashboard'),
                App.fetchAPI('/analytics/production'),
                App.fetchAPI('/analytics/inventory')
            ]);
        } catch (error) {
            console.error('Error loading dashboard data:', error);
        }
    },

    renderStats() {
        const statsContainer = document.getElementById('dashboard-stats');
        const stats = this.data.stats;

        if (!stats) {
            statsContainer.innerHTML = '<p class="text-center">Unable to load statistics</p>';
            return;
        }

        statsContainer.innerHTML = `
            <div class="stat-card">
                <div class="stat-header">
                    <div class="stat-icon">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                        </svg>
                    </div>
                    ${stats.lowStockCount > 0 ? `<div class="badge badge-warning">${stats.lowStockCount} Low</div>` : ''}
                </div>
                <div class="stat-value">${stats.rawMaterialsCount}</div>
                <div class="stat-label">Raw Materials</div>
            </div>
            
            <div class="stat-card">
                <div class="stat-header">
                    <div class="stat-icon" style="color: var(--accent-secondary)">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
                        </svg>
                    </div>
                </div>
                <div class="stat-value">${stats.wipCount}</div>
                <div class="stat-label">In Production</div>
            </div>
            
            <div class="stat-card">
                <div class="stat-header">
                    <div class="stat-icon" style="color: var(--accent-success)">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="12" cy="12" r="10"></circle>
                            <path d="M12 6v6l4 2"></path>
                        </svg>
                    </div>
                </div>
                <div class="stat-value">${stats.finishedProductsCount}</div>
                <div class="stat-label">Finished Products</div>
            </div>
            
            <div class="stat-card">
                <div class="stat-header">
                    <div class="stat-icon" style="color: var(--accent-warning)">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                            <polyline points="22 4 12 14.01 9 11.01"></polyline>
                        </svg>
                    </div>
                    ${stats.qualityIssuesCount > 0 ? `<div class="badge badge-danger">${stats.qualityIssuesCount} Issues</div>` : ''}
                </div>
                <div class="stat-value">${stats.qualityPassRate}%</div>
                <div class="stat-label">Quality Pass Rate</div>
            </div>
        `;
    },

    renderPipeline() {
        const pipelineContainer = document.getElementById('pipeline-content');
        const production = this.data.production;

        if (!production) {
            pipelineContainer.innerHTML = '<p class="text-center">Unable to load pipeline data</p>';
            return;
        }

        const stages = Object.entries(production.wipByStage || {});

        if (stages.length === 0) {
            pipelineContainer.innerHTML = `
                <div class="empty-state">
                    <h3>No Active Production</h3>
                    <p>Start a new production batch to see the pipeline</p>
                </div>
            `;
            return;
        }

        pipelineContainer.innerHTML = `
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 16px;">
                ${stages.map(([stage, count]) => `
                    <div style="padding: 20px; background: var(--bg-glass); border-radius: var(--radius-inner); border: 1px solid var(--border-glass);">
                        <div style="font-size: 1.5rem; font-weight: 700; margin-bottom: 4px;">${count}</div>
                        <div style="color: var(--text-tertiary); font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.05em;">${stage}</div>
                    </div>
                `).join('')}
            </div>
            
            <div style="margin-top: 24px; padding: 16px; background: rgba(0, 122, 255, 0.05); border-radius: 12px; border: 1px solid rgba(0, 122, 255, 0.1); font-size: 0.9rem; color: var(--text-secondary);">
                <strong>Production Summary:</strong> ${production.activeProduction} active batches, ${production.completedToday} completed today
            </div>
        `;
    },

    renderAlerts() {
        const alertsContainer = document.getElementById('alerts-content');
        const stats = this.data.stats;

        if (!stats) {
            alertsContainer.innerHTML = '<p class="text-center">Unable to load alerts</p>';
            return;
        }

        const alerts = [];

        if (stats.lowStockCount > 0) {
            alerts.push({
                type: 'warning',
                title: 'Low Stock Alert',
                message: `${stats.lowStockCount} raw materials are below minimum stock level`,
                items: stats.lowStockMaterials
            });
        }

        if (stats.qualityIssuesCount > 0) {
            alerts.push({
                type: 'danger',
                title: 'Quality Issues',
                message: `${stats.qualityIssuesCount} quality check failures detected`,
                items: []
            });
        }

        if (alerts.length === 0) {
            alertsContainer.innerHTML = `
                <div class="alert alert-info">
                    <span>All systems operational. No alerts at this time.</span>
                </div>
            `;
            return;
        }

        alertsContainer.innerHTML = alerts.map(alert => `
            <div class="alert alert-${alert.type}">
                <div style="flex: 1;">
                    <strong style="display: block; margin-bottom: 4px;">${alert.title}</strong>
                    <p style="margin: 0; font-size: 0.85rem; opacity: 0.9;">${alert.message}</p>
                    ${alert.items && alert.items.length > 0 ? `
                        <div style="margin-top: 12px; display: flex; flex-wrap: wrap; gap: 8px;">
                            ${alert.items.map(item => `<span class="badge" style="background: rgba(255,255,255,0.1); color: inherit;">${item.name} (${item.quantity})</span>`).join('')}
                        </div>
                    ` : ''}
                </div>
            </div>
        `).join('');
    }
};
