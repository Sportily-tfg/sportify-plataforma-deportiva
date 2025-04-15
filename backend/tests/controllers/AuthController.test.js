const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { register, login } = require('../../controllers/authController');
const Usuario = require('../../models/Usuario');

// Mocks
jest.mock('../../models/Usuario');
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');

describe('Auth Controller', () => {
  let mockReq, mockRes;

  beforeEach(() => {
    mockReq = {
      body: {}
    };
    
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    
    process.env.JWT_SECRET = 'test-secret';
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    test('should register a new user successfully with valid data', async () => {
      mockReq.body = {
        nombre: 'Test User',
        email: 'test@example.com',
        contraseña: 'ValidPass123'
      };
      
      Usuario.findByEmail.mockResolvedValue(null);
      bcrypt.hash.mockResolvedValue('hashedpassword');
      Usuario.create.mockResolvedValue(1);
      
      await register(mockReq, mockRes);
      
      expect(Usuario.findByEmail).toHaveBeenCalledWith('test@example.com');
      expect(bcrypt.hash).toHaveBeenCalledWith('ValidPass123', 10);
      expect(Usuario.create).toHaveBeenCalledWith({
        nombre: 'Test User',
        email: 'test@example.com',
        contraseña: 'hashedpassword'
      });
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Usuario registrado con éxito',
        userId: 1
      });
    });

    test('should return error when email already exists', async () => {
      mockReq.body = {
        nombre: 'Test User',
        email: 'existing@example.com',
        contraseña: 'ValidPass123'
      };
      
      Usuario.findByEmail.mockResolvedValue({ id_usuario: 1 });
      
      await register(mockReq, mockRes);
      
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'El email ya está registrado'
      });
    });

    test('should return error when password is invalid', async () => {
      mockReq.body = {
        nombre: 'Test User',
        email: 'test@example.com',
        contraseña: 'weak' // Contraseña que fallará todas las validaciones
      };
      
      await register(mockReq, mockRes);
      
      const response = mockRes.json.mock.calls[0][0];
      
      // Verificaciones
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(response.error).toBe('Contraseña no válida');
      
      expect(response.details).toContain('Mínimo 8 caracteres');
      expect(response.details).toContain('Al menos una mayúscula');
      
      if (response.details.includes('Al menos una minúscula')) {
        expect(response.details).toContain('Al menos una minúscula');
      }
      if (response.details.includes('Al menos un número')) {
        expect(response.details).toContain('Al menos un número');
      }
    });

    test('should return error when required fields are missing', async () => {
      mockReq.body = {
        nombre: '',
        email: '',
        contraseña: ''
      };
      
      await register(mockReq, mockRes);
      
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Todos los campos son obligatorios'
      });
    });

    test('should handle server errors during registration', async () => {
      mockReq.body = {
        nombre: 'Test User',
        email: 'test@example.com',
        contraseña: 'ValidPass123'
      };
      
      Usuario.findByEmail.mockRejectedValue(new Error('DB error'));
      
      await register(mockReq, mockRes);
      
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Error en el servidor',
        detalle: 'DB error'
      });
    });
  });
});