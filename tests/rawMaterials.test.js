const request = require('supertest');
const app = require('../server');
const dbHandler = require('./db-handler');

jest.setTimeout(60000); // 1 minute timeout for DB setup

beforeAll(async () => await dbHandler.connect());
afterEach(async () => await dbHandler.clearDatabase());
afterAll(async () => await dbHandler.closeDatabase());

describe('Raw Materials API', () => {
    it('should create a new raw material', async () => {
        const res = await request(app)
            .post('/api/raw-materials')
            .send({
                name: 'Steel Bar',
                category: 'Metal',
                quantity: 100,
                unit: 'pcs',
                costPerUnit: 15.5
            });

        expect(res.statusCode).toEqual(201);
        expect(res.body.name).toEqual('Steel Bar');
    });

    it('should fail if required fields are missing', async () => {
        const res = await request(app)
            .post('/api/raw-materials')
            .send({
                name: 'Incomplete Material'
            });

        expect(res.statusCode).toEqual(400);
        expect(res.body.error).toEqual('Validation failed');
    });

    it('should get all raw materials', async () => {
        await request(app)
            .post('/api/raw-materials')
            .send({
                name: 'Material 1',
                category: 'Cat 1',
                quantity: 10,
                unit: 'kg'
            });

        const res = await request(app).get('/api/raw-materials');

        expect(res.statusCode).toEqual(200);
        expect(res.body.length).toEqual(1);
        expect(res.body[0].name).toEqual('Material 1');
    });
});
