// importa el modelo
const Usuario = require('../../models/Usuario');
// importa el módulo de la conexión de la bbdd
const pool = require('../../config/db');

//Mockea el módulo de la bbdd, reemplazando la duncion query por una función Jest
jest.mock('../../config/db', () => ({
  query: jest.fn()
}));

// Describe el conjunto de pruebas para el modelo Usuario
describe('Modelo Usuario', () => {
  //define un usuario mock para usar en las pruebas
  const mockUser = {
    id_usuario: 1,
    email: 'test@example.com',
    contraseña: 'hashedpass'
  };

  //Se ejecuta antes de cada prueba para limpiar los mock
  beforeEach(() => {
    jest.clearAllMocks();
  });

  //Prueba para el método findByEmail
  test('findByEmail devuelve usuario cuando existe', async () => {
    // configura ek nick para que devuelva nuestro usuario de prueba
    pool.query.mockResolvedValue({ rows: [mockUser] });

    // ejecuta el método que estamos probando
    const result = await Usuario.findByEmail('test@example.com');
    
    // verifica que el resultado sea igual a nuestro usuario mock
    expect(result).toEqual(mockUser);
    // verifica que se llamó a la función query con los parámetro correctos
    expect(pool.query).toHaveBeenCalledWith(
      'SELECT * FROM usuarios WHERE email = $1',
      ['test@example.com']
    );
  });

  // prueba específicamente el método create
  test('create inserta nuevo usuario correctamente', async () => {
    // define los datos de un nuevo usuario para la prueba
    const newUser = {
      nombre: 'Nuevo Usuario',
      email: 'nuevo@example.com',
      contraseña: 'password123'
    };
    
    // Configurar el mock para simular una inserción exitosa
    pool.query.mockResolvedValue({ rows: [{ id_usuario: 2 }] });

    // ejecuta el método create con nuestros datos de prueba
    const result = await Usuario.create(newUser);
    
    // verifica que el resultado sea el id esperado
    expect(result).toBe(2);
    
    // Verifica que se llamó a la función query con una consulta sql y los parámetros esperados.
    expect(pool.query).toHaveBeenCalledWith(
      expect.stringContaining('INSERT INTO usuarios (nombre, email, contraseña)'),
      [newUser.nombre, newUser.email, newUser.contraseña]
    );
  });
});