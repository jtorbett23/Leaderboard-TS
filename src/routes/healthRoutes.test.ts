import request from 'supertest';
import app from '../app';

describe('GET /health', () => {

    it('should return UP', async () => {
        const res = await request(app)
            .get(`/health`)
            .expect('Content-Type', /json/)
            .expect(200);

        expect(res.body).toStrictEqual({status: 'UP'});
    });

});
