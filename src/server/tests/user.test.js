const userRepository = require('../repositories/user.repositories');
const { pool } = require('../config/db');

jest.mock('../config/db', () => ({
  pool: {
    query: jest.fn(),
  },
}));

describe('updateProfile', () => {
  it('Dovrebbe eseguire l\'update dello user e ritornare lo user aggiornato', async () => {
    // Mock del risultato del database
    pool.query.mockResolvedValue({
      rows: [
        {
          id: 8,
          email: 'test@gmail.com',
          password: 'hashedPassword123',
          phone: '1234567890',
        },
      ],
    });

    const result = await userRepository.updateProfile(8, 'newPassword123', '1234567890');

    // Controlla che la query sia stata chiamata con i parametri corretti
    expect(pool.query).toHaveBeenCalledWith(
      expect.stringContaining('UPDATE users'), // Controlla che sia la query corretta
      [8, 'newPassword123', '1234567890'] // Parametri passati
    );

    // Controlla il risultato
    expect(result).toEqual({
      id: 8,
      email: 'test@gmail.com',
      password: 'newPassword123',
      phone: '1234567890',
    });
  });

  it('Non dovrebbe eseguire l\'update dello user se i valori "phone" e "password" sono null', async () => {
    pool.query.mockResolvedValue({ rows: [] });

    const result = await userRepository.updateProfile(8, null, null);

    expect(pool.query).toHaveBeenCalledWith(
      expect.stringContaining('UPDATE users'),
      [8, null, null]
    );

    // Controlla che il risultato sia vuoto
    expect(result).toBeUndefined();
  });
});
