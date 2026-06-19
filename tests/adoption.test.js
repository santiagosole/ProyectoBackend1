import express from 'express';
import request from 'supertest';
import { jest } from '@jest/globals';

const mockSpawn = jest.fn();

jest.unstable_mockModule('child_process', () => ({
  spawn: mockSpawn
}));

const { spawn } = await import('child_process');
const adoptionRouter = (await import('../src/routes/adoption.router.js')).default;

describe('Adoption Router', () => {
  let app;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use('/adoptions', adoptionRouter);
    jest.clearAllMocks();
  });

  describe('GET /adoptions', () => {
    it('should return empty list initially', async () => {
      const response = await request(app)
        .get('/adoptions')
        .expect(200);

      expect(response.body.data).toEqual([]);
    });

    it('should return list of adoptions after creating one', async () => {
      const mockChildProcess = {
        stdout: { on: jest.fn() },
        stderr: { on: jest.fn() },
        on: jest.fn()
      };

      mockSpawn.mockReturnValue(mockChildProcess);

      mockChildProcess.on.mockImplementation((event, callback) => {
        if (event === 'close') {
          mockChildProcess.stdout.on.mock.calls[0][1](
            JSON.stringify({ valid: true, status: 'approved' })
          );
          callback(0);
        }
      });

      await request(app)
        .post('/adoptions')
        .send({ userId: 'u1', petId: 'p1' })
        .expect(201);

      const response = await request(app)
        .get('/adoptions')
        .expect(200);

      expect(response.body.data.length).toBe(1);
    });
  });

  describe('POST /adoptions', () => {
    it('should create adoption with valid data', async () => {
      const mockChildProcess = {
        stdout: { on: jest.fn() },
        stderr: { on: jest.fn() },
        on: jest.fn()
      };

      mockSpawn.mockReturnValue(mockChildProcess);

      // Simular respuesta exitosa del worker
      mockChildProcess.on.mockImplementation((event, callback) => {
        if (event === 'close') {
          mockChildProcess.stdout.on.mock.calls[0][1](
            JSON.stringify({ valid: true, status: 'approved' })
          );
          callback(0);
        }
      });

      const response = await request(app)
        .post('/adoptions')
        .send({ userId: 'u1', petId: 'p1' })
        .expect(201);

      expect(response.body.data).toMatchObject({
        id: expect.any(String),
        userId: 'u1',
        petId: 'p1',
        status: 'approved'
      });
    });

    it('should return 400 when userId is missing', async () => {
      const response = await request(app)
        .post('/adoptions')
        .send({ petId: 'p1' })
        .expect(400);

      expect(response.body.error).toBe('Bad Request');
      expect(response.body.details).toContain('Missing userId or petId');
    });

    it('should return 400 when petId is missing', async () => {
      const response = await request(app)
        .post('/adoptions')
        .send({ userId: 'u1' })
        .expect(400);

      expect(response.body.error).toBe('Bad Request');
    });

    it('should handle worker rejection and create adoption with rejected status', async () => {
      const mockChildProcess = {
        stdout: { on: jest.fn() },
        stderr: { on: jest.fn() },
        on: jest.fn()
      };

      mockSpawn.mockReturnValue(mockChildProcess);

      mockChildProcess.on.mockImplementation((event, callback) => {
        if (event === 'close') {
          mockChildProcess.stdout.on.mock.calls[0][1](
            JSON.stringify({ valid: false, status: 'rejected', reason: 'Invalid IDs' })
          );
          callback(0);
        }
      });

      const response = await request(app)
        .post('/adoptions')
        .send({ userId: 'invalidUser', petId: 'invalidPet' })
        .expect(201);

      expect(response.body.data.status).toBe('rejected');
    });

    it('should handle worker process error', async () => {
      const mockChildProcess = {
        stdout: { on: jest.fn() },
        stderr: { on: jest.fn((event, cb) => {
          cb('Error from worker');
        }) },
        on: jest.fn()
      };

      mockSpawn.mockReturnValue(mockChildProcess);

      mockChildProcess.on.mockImplementation((event, callback) => {
        if (event === 'close') {
          callback(1);
        }
      });

      const response = await request(app)
        .post('/adoptions')
        .send({ userId: 'u1', petId: 'p1' })
        .expect(201);

      expect(response.body.data).toHaveProperty('status');
    });
  });

  describe('GET /adoptions/:id', () => {
    it('should return adoption by id', async () => {
      const mockChildProcess = {
        stdout: { on: jest.fn() },
        stderr: { on: jest.fn() },
        on: jest.fn()
      };

      mockSpawn.mockReturnValue(mockChildProcess);

      mockChildProcess.on.mockImplementation((event, callback) => {
        if (event === 'close') {
          mockChildProcess.stdout.on.mock.calls[0][1](
            JSON.stringify({ valid: true, status: 'approved' })
          );
          callback(0);
        }
      });

      const createResponse = await request(app)
        .post('/adoptions')
        .send({ userId: 'u1', petId: 'p1' })
        .expect(201);

      const adoptionId = createResponse.body.data.id;

      const getResponse = await request(app)
        .get(`/adoptions/${adoptionId}`)
        .expect(200);

      expect(getResponse.body.data).toMatchObject({
        id: adoptionId,
        userId: 'u1',
        petId: 'p1'
      });
    });

    it('should return 404 for non-existent adoption', async () => {
      const response = await request(app)
        .get('/adoptions/999')
        .expect(404);

      expect(response.body.error).toBe('Not Found');
      expect(response.body.details).toContain('not found');
    });
  });
});
