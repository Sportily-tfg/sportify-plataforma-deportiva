// para el has de contraseñas
const bcrypt = require('bcryptjs');
// para la generacion de tokens
const jwt = require('jsonwebtoken');
const { register, login } = require('../../controllers/authController');
const Usuario = require('../../models/Usuario');

// Mocks
jest.mock('../../models/Usuario');
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');

// describe el conjutno de pruebas para el controlador
describe('Auth Controller', () => {
  // variables para almacenar los objetos
  let mockReq, mockRes;

  // se ejecuta antes de cada prueba
  beforeEach(() => {
    mockReq = {
      body: {}
    };
    
    // mock del objeto response con las funciones
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    
    process.env.JWT_SECRET = 'test-secret';
  });

  // limpieza que se ejecuta después de cada prueba
  afterEach(() => {
    jest.clearAllMocks();
  });

  // describe las pruebas para la función del registro
  describe('register', () => {
    // prueba para registro exitoso
    test('should register a new user successfully', async () => {
      mockReq.body = {
        nombre: 'Test User',
        email: 'test@example.com',
        contraseña: 'password123'
      };
      
      // configura los mocks para simular el comportamiento esperado
      Usuario.findByEmail.mockResolvedValue(null);
      bcrypt.hash.mockResolvedValue('hashedpassword');
      Usuario.create.mockResolvedValue(1);
      
      // verificaciones
      await register(mockReq, mockRes);
      
      expect(Usuario.findByEmail).toHaveBeenCalledWith('test@example.com');
      expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);
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

    // prueba: error cuando el email ya está registrado
    test('should return error when email already exists', async () => {
      mockReq.body = {
        nombre: 'Test User',
        email: 'existing@example.com',
        contraseña: 'password123'
      };
      
      // simula que el email ya existe
      Usuario.findByEmail.mockResolvedValue({ id_usuario: 1 });
      //ejecuta la función
      await register(mockReq, mockRes);
      
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'El email ya está registrado'
      });
    });
  });

  // describe las pruebas para la función de login
  describe('login', () => {
    // prueba para los credenciales
    test('should login successfully with correct credentials', async () => {
      mockReq.body = {
        email: 'test@example.com',
        contraseña: 'correctpass'
      };
      
      const mockUser = {
        id_usuario: 1,
        email: 'test@example.com',
        nombre: 'Test User',
        contraseña: 'hashedpass'
      };
      
      // configura los mocks
      Usuario.findByEmail.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(true);
      jwt.sign.mockReturnValue('fake-token');
      
      // ejecuta la funcion 
      await login(mockReq, mockRes);
      
      // verificaciones
      expect(bcrypt.compare).toHaveBeenCalledWith('correctpass', 'hashedpass');
      expect(jwt.sign).toHaveBeenCalledWith(
        {
          id: 1,
          email: 'test@example.com',
          nombre: 'Test User'
        },
        'test-secret',
        { expiresIn: '1h' }
      );
      expect(mockRes.json).toHaveBeenCalledWith({
        token: 'fake-token',
        user: {
          id: 1,
          nombre: 'Test User',
          email: 'test@example.com'
        }
      });
    });

    // error con contraseña incorrecta
    test('should return error with incorrect password', async () => {
      mockReq.body = {
        email: 'test@example.com',
        contraseña: 'wrongpass'
      };
      
      const mockUser = {
        id_usuario: 1,
        email: 'test@example.com',
        contraseña: 'hashedpass'
      };
      
      Usuario.findByEmail.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(false);
      
      await login(mockReq, mockRes);
      
      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Contraseña incorrecta'
      });
    });
  });
});