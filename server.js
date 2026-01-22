const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { MongoClient, ObjectId } = require('mongodb');
const path = require('path');

const app = express();
const PORT = 3000;

// MongoDB connection
const MONGO_URL = 'mongodb://localhost:27017';
const DB_NAME = 'manufacturing_tracking';
let db;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// Connect to MongoDB
MongoClient.connect(MONGO_URL)
  .then(client => {
    console.log('Connected to MongoDB');
    db = client.db(DB_NAME);
    
    // Create indexes for better performance
    db.collection('rawMaterials').createIndex({ name: 1 });
    db.collection('processes').createIndex({ name: 1 });
    db.collection('wip').createIndex({ batchNumber: 1 });
    db.collection('finishedProducts').createIndex({ sku: 1 });
    db.collection('qualityChecks').createIndex({ itemReference: 1 });
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// ==================== RAW MATERIALS ENDPOINTS ====================

// Get all raw materials
app.get('/api/raw-materials', async (req, res) => {
  try {
    const materials = await db.collection('rawMaterials').find().toArray();
    res.json(materials);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add new raw material
app.post('/api/raw-materials', async (req, res) => {
  try {
    const material = {
      ...req.body,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    const result = await db.collection('rawMaterials').insertOne(material);
    res.status(201).json({ ...material, _id: result.insertedId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update raw material
app.put('/api/raw-materials/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const update = {
      ...req.body,
      updatedAt: new Date()
    };
    delete update._id;
    
    const result = await db.collection('rawMaterials').updateOne(
      { _id: new ObjectId(id) },
      { $set: update }
    );
    
    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Material not found' });
    }
    
    res.json({ message: 'Material updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete raw material
app.delete('/api/raw-materials/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.collection('rawMaterials').deleteOne({ _id: new ObjectId(id) });
    
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Material not found' });
    }
    
    res.json({ message: 'Material deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==================== MANUFACTURING PROCESSES ENDPOINTS ====================

// Get all processes
app.get('/api/processes', async (req, res) => {
  try {
    const processes = await db.collection('processes').find().toArray();
    res.json(processes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add new process
app.post('/api/processes', async (req, res) => {
  try {
    const process = {
      ...req.body,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    const result = await db.collection('processes').insertOne(process);
    res.status(201).json({ ...process, _id: result.insertedId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update process
app.put('/api/processes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const update = {
      ...req.body,
      updatedAt: new Date()
    };
    delete update._id;
    
    const result = await db.collection('processes').updateOne(
      { _id: new ObjectId(id) },
      { $set: update }
    );
    
    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Process not found' });
    }
    
    res.json({ message: 'Process updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete process
app.delete('/api/processes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.collection('processes').deleteOne({ _id: new ObjectId(id) });
    
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Process not found' });
    }
    
    res.json({ message: 'Process deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==================== WORK IN PROGRESS ENDPOINTS ====================

// Get all WIP items
app.get('/api/wip', async (req, res) => {
  try {
    const wipItems = await db.collection('wip').find().toArray();
    res.json(wipItems);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start new production batch
app.post('/api/wip', async (req, res) => {
  try {
    const wipItem = {
      ...req.body,
      startDate: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    const result = await db.collection('wip').insertOne(wipItem);
    res.status(201).json({ ...wipItem, _id: result.insertedId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update WIP progress
app.put('/api/wip/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const update = {
      ...req.body,
      updatedAt: new Date()
    };
    delete update._id;
    
    const result = await db.collection('wip').updateOne(
      { _id: new ObjectId(id) },
      { $set: update }
    );
    
    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'WIP item not found' });
    }
    
    res.json({ message: 'WIP updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Cancel production (delete WIP)
app.delete('/api/wip/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.collection('wip').deleteOne({ _id: new ObjectId(id) });
    
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'WIP item not found' });
    }
    
    res.json({ message: 'Production cancelled successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==================== FINISHED PRODUCTS ENDPOINTS ====================

// Get all finished products
app.get('/api/finished-products', async (req, res) => {
  try {
    const products = await db.collection('finishedProducts').find().toArray();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add finished product
app.post('/api/finished-products', async (req, res) => {
  try {
    const product = {
      ...req.body,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    const result = await db.collection('finishedProducts').insertOne(product);
    res.status(201).json({ ...product, _id: result.insertedId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update finished product
app.put('/api/finished-products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const update = {
      ...req.body,
      updatedAt: new Date()
    };
    delete update._id;
    
    const result = await db.collection('finishedProducts').updateOne(
      { _id: new ObjectId(id) },
      { $set: update }
    );
    
    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    res.json({ message: 'Product updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete finished product
app.delete('/api/finished-products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.collection('finishedProducts').deleteOne({ _id: new ObjectId(id) });
    
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==================== QUALITY CHECKS ENDPOINTS ====================

// Get all quality checks
app.get('/api/quality-checks', async (req, res) => {
  try {
    const checks = await db.collection('qualityChecks').find().toArray();
    res.json(checks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get quality checks for specific item
app.get('/api/quality-checks/:itemId', async (req, res) => {
  try {
    const { itemId } = req.params;
    const checks = await db.collection('qualityChecks')
      .find({ itemReference: itemId })
      .toArray();
    res.json(checks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Record new quality check
app.post('/api/quality-checks', async (req, res) => {
  try {
    const check = {
      ...req.body,
      inspectionDate: new Date(),
      createdAt: new Date()
    };
    const result = await db.collection('qualityChecks').insertOne(check);
    res.status(201).json({ ...check, _id: result.insertedId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==================== ANALYTICS ENDPOINTS ====================

// Dashboard statistics
app.get('/api/analytics/dashboard', async (req, res) => {
  try {
    const [rawMaterialsCount, wipCount, finishedProductsCount, processesCount, qualityChecks] = await Promise.all([
      db.collection('rawMaterials').countDocuments(),
      db.collection('wip').countDocuments(),
      db.collection('finishedProducts').countDocuments(),
      db.collection('processes').countDocuments(),
      db.collection('qualityChecks').find().limit(100).toArray()
    ]);

    // Calculate low stock materials
    const rawMaterials = await db.collection('rawMaterials').find().toArray();
    const lowStockMaterials = rawMaterials.filter(m => 
      m.quantity <= (m.minimumStockLevel || 0)
    );

    // Recent quality issues
    const recentQualityIssues = qualityChecks.filter(q => q.status === 'fail').length;

    // Pass rate
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
    res.status(500).json({ error: err.message });
  }
});

// Production metrics
app.get('/api/analytics/production', async (req, res) => {
  try {
    const wipItems = await db.collection('wip').find().toArray();
    const finishedProducts = await db.collection('finishedProducts').find().toArray();

    // Calculate average production time (mock calculation)
    const avgProductionTime = wipItems.length > 0 
      ? wipItems.reduce((sum, item) => sum + (item.progress || 0), 0) / wipItems.length
      : 0;

    res.json({
      activeProduction: wipItems.length,
      completedToday: finishedProducts.filter(p => {
        const today = new Date();
        const mfgDate = new Date(p.manufacturingDate);
        return mfgDate.toDateString() === today.toDateString();
      }).length,
      averageProgress: avgProductionTime.toFixed(1),
      wipByStage: wipItems.reduce((acc, item) => {
        acc[item.currentStage || 'Unknown'] = (acc[item.currentStage || 'Unknown'] || 0) + 1;
        return acc;
      }, {})
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Inventory analysis
app.get('/api/analytics/inventory', async (req, res) => {
  try {
    const rawMaterials = await db.collection('rawMaterials').find().toArray();
    const finishedProducts = await db.collection('finishedProducts').find().toArray();

    const totalRawMaterialValue = rawMaterials.reduce((sum, m) => 
      sum + (m.quantity * m.costPerUnit || 0), 0
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
        .sort((a, b) => (b.quantity * b.costPerUnit) - (a.quantity * a.costPerUnit))
        .slice(0, 5)
        .map(m => ({ name: m.name, value: (m.quantity * m.costPerUnit).toFixed(2) }))
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Serve index.html for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`Manufacturing Tracking Server running on http://localhost:${PORT}`);
});
