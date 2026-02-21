const { z } = require('zod');

const rawMaterialSchema = z.object({
    body: z.object({
        name: z.string().min(1, 'Name is required'),
        category: z.string().min(1, 'Category is required'),
        quantity: z.number().min(0, 'Quantity cannot be negative'),
        unit: z.string().min(1, 'Unit is required'),
        minimumStockLevel: z.number().min(0).optional(),
        costPerUnit: z.number().min(0).optional(),
        supplier: z.string().optional(),
        location: z.string().optional(),
        specs: z.record(z.string()).optional()
    })
});

const processSchema = z.object({
    body: z.object({
        name: z.string().min(1, 'Name is required'),
        description: z.string().optional(),
        stages: z.array(z.object({
            name: z.string().min(1),
            duration: z.number().min(0).optional(),
            description: z.string().optional(),
            order: z.number().optional()
        })).optional(),
        estimatedTotalTime: z.number().min(0).optional(),
        requiredCertifications: z.array(z.string()).optional()
    })
});

const wipSchema = z.object({
    body: z.object({
        batchNumber: z.string().min(1),
        productId: z.string().min(1),
        processId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid process ID'),
        quantity: z.number().min(1),
        currentStage: z.string().min(1),
        progress: z.number().min(0).max(100).optional(),
        startDate: z.string().datetime().optional(),
        estimatedCompletionDate: z.string().datetime().optional(),
        status: z.enum(['scheduled', 'in-progress', 'paused', 'completed', 'cancelled']).optional(),
        assignedOperators: z.array(z.string()).optional()
    })
});

const finishedProductSchema = z.object({
    body: z.object({
        sku: z.string().min(1),
        name: z.string().min(1),
        description: z.string().optional(),
        quantity: z.number().min(0),
        unit: z.string().optional(),
        manufacturingDate: z.string().datetime().optional(),
        expiryDate: z.string().datetime().optional(),
        batchNumber: z.string().optional(),
        location: z.string().optional(),
        qualityStatus: z.enum(['pass', 'fail', 'pending']).optional()
    })
});

const qualityCheckSchema = z.object({
    body: z.object({
        itemReference: z.string().min(1),
        itemType: z.enum(['wip', 'finished']),
        inspector: z.string().min(1),
        inspectionDate: z.string().datetime().optional(),
        status: z.enum(['pass', 'fail']),
        measurements: z.array(z.object({
            parameter: z.string(),
            value: z.number(),
            unit: z.string(),
            min: z.number().optional(),
            max: z.number().optional(),
            result: z.enum(['ok', 'out-of-range']).optional()
        })).optional(),
        notes: z.string().optional(),
        attachments: z.array(z.string()).optional()
    })
});

module.exports = {
    rawMaterialSchema,
    processSchema,
    wipSchema,
    finishedProductSchema,
    qualityCheckSchema
};
