const RawMaterial = require('../models/RawMaterial');
const Wip = require('../models/Wip');
const FinishedProduct = require('../models/FinishedProduct');
const Process = require('../models/Process');
const QualityCheck = require('../models/QualityCheck');

// @desc    Dashboard statistics
// @route   GET /api/analytics/dashboard
exports.getDashboardStats = async (req, res, next) => {
    try {
        const [rawMaterialsCount, wipCount, finishedProductsCount, processesCount, qualityChecks] = await Promise.all([
            RawMaterial.countDocuments(),
            Wip.countDocuments(),
            FinishedProduct.countDocuments(),
            Process.countDocuments(),
            QualityCheck.find().limit(100).lean()
        ]);

        const rawMaterials = await RawMaterial.find().lean();
        const lowStockMaterials = rawMaterials.filter(m =>
            m.quantity <= (m.minimumStockLevel || 0)
        );

        const recentQualityIssues = qualityChecks.filter(q => q.status === 'fail').length;

        const passedChecks = qualityChecks.filter(q => q.status === 'pass').length;
        const qualityPassRate = qualityChecks.length > 0
            ? ((passedChecks / qualityChecks.length) * 100).toFixed(1)
            : 100;

        res.json({
            rawMaterialsCount,
            wipCount,
            finishedProductsCount,
            processesCount,
            lowStockCount: lowStockMaterials.length,
            qualityIssuesCount: recentQualityIssues,
            qualityPassRate,
            lowStockMaterials: lowStockMaterials.slice(0, 5)
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Production metrics
// @route   GET /api/analytics/production
exports.getProductionMetrics = async (req, res, next) => {
    try {
        const wipItems = await Wip.find().lean();
        const finishedProducts = await FinishedProduct.find().lean();

        const avgProgress = wipItems.length > 0
            ? wipItems.reduce((sum, item) => sum + (item.progress || 0), 0) / wipItems.length
            : 0;

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        res.json({
            activeProduction: wipItems.length,
            completedToday: finishedProducts.filter(p => {
                const mfgDate = new Date(p.manufacturingDate);
                return mfgDate >= today;
            }).length,
            averageProgress: avgProgress.toFixed(1),
            wipByStage: wipItems.reduce((acc, item) => {
                acc[item.currentStage || 'Unknown'] = (acc[item.currentStage || 'Unknown'] || 0) + 1;
                return acc;
            }, {})
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Inventory analysis
// @route   GET /api/analytics/inventory
exports.getInventoryAnalysis = async (req, res, next) => {
    try {
        const rawMaterials = await RawMaterial.find().lean();
        const finishedProducts = await FinishedProduct.find().lean();

        const totalRawMaterialValue = rawMaterials.reduce((sum, m) =>
            sum + (m.quantity * (m.costPerUnit || 0)), 0
        );

        const totalFinishedProducts = finishedProducts.reduce((sum, p) =>
            sum + (p.quantity || 0), 0
        );

        res.json({
            totalRawMaterialValue: totalRawMaterialValue.toFixed(2),
            totalFinishedProducts,
            rawMaterialTypes: rawMaterials.length,
            finishedProductTypes: finishedProducts.length,
            topMaterials: rawMaterials
                .sort((a, b) => (b.quantity * (b.costPerUnit || 0)) - (a.quantity * (a.costPerUnit || 0)))
                .slice(0, 5)
                .map(m => ({ name: m.name, value: (m.quantity * (m.costPerUnit || 0)).toFixed(2) }))
        });
    } catch (err) {
        next(err);
    }
};
