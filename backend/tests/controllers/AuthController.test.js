// importar dependencias necesarias
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { register, login } = require('../../controllers/authController');
const Usuario = require('../../models/Usuario');

// Mocks para simular los módulos y evitar dependencias locales
jest.mock('../../models/Usuario');
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');

// Configuración de un entorno limpio para las pruebas.
describe('Auth Controller', () => {
  // simulan solicitud y respuesta http
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

  // limpia los mocks despues de cada test
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    // Prueba de registro exitoso
    test(' debería registrarse un nuevo usuario de forma satisfactoria con datos válidos', async () => {
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

    // Pruebas de validacion de errores
    // emails existentes
    test('Debería devolver un error cuando el email ya exista.', async () => {
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

    // contraseña inválida
    test('debería devolver un error cuando la contraseña no sea válida', async () => {
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

    // campos vacios
    test('debería devolver un error cuando haya campos vacios', async () => {
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

    // error en el servidor
    test('debería manejar errores de servidor durante el registro', async () => {
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