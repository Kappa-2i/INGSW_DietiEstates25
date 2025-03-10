const { removeFavorite } = require('../repositories/favorite.repository');
const { updateProfile } = require('../repositories/user.repository');
const pool = require('../config/db'); 

jest.mock('../config/db', () => ({
  query: jest.fn(),
}));

describe('removeFavorite N-Sect', () => {


  console.log("userId:\n 1) CEuId1 = userId >= 1 (valid) \n 2) CEuId2 = userId < 1 (not valid)");
  console.log("insertionId:\n 1) CEiId1 = insertionId >= 1 (valid)\n 2) CEiId2 = insertionId < 1 (not valid)");
  console.log("---------------------------------------");


  test('N-Sect con copertura su classi CEuId1 e CEiId1: deve rimuovere il preferito correttamente', async () => {
    const validUserId = 1;
    const validInsertionId = 1;
    const fakeRow = { userid: validUserId, insertionid: validInsertionId };

    // Imposta il mock per gestire i parametri validi
    pool.query.mockImplementation((query, params) => {
      if (params[0] >= 1 && params[1] >= 1) {
        return Promise.resolve({ rows: [fakeRow] });
      }
      return Promise.reject(new Error("Parametri non validi"));
    });

    const result = await removeFavorite(validUserId, validInsertionId);
    expect(result).toEqual(fakeRow);
  });

  test('N-Sect con copertura su classi CEuId2 e CEiId2: deve lanciare errore', async () => {
    const invalidUserId = 0;
    const invalidInsertionId = -2;

    // Imposta il mock per rifiutare la Promise se i parametri non sono validi
    pool.query.mockImplementation((query, params) => {
      if (params[0] >= 1 && params[1] >= 1) {
        return Promise.resolve({ rows: [fakeRow] });
      }
      return Promise.reject(new Error("Parametri non validi"));
    });

    await expect(removeFavorite(invalidUserId, invalidInsertionId))
      .rejects.toThrow('Parametri non validi');
  });

  test('N-Sect con copertura su classi CEuId1 e CEiId2: deve lanciare errore', async () => {
    const invalidUserId = 1;
    const invalidInsertionId = -2;

    // Imposta il mock per rifiutare la Promise se i parametri non sono validi
    pool.query.mockImplementation((query, params) => {
      if (params[0] >= 1 && params[1] >= 1) {
        return Promise.resolve({ rows: [fakeRow] });
      }
      return Promise.reject(new Error("Parametri non validi"));
    });

    await expect(removeFavorite(invalidUserId, invalidInsertionId))
      .rejects.toThrow('Parametri non validi');
  });

  test('N-Sect con copertura su classi CEuId2 e CEiId1: deve lanciare errore', async () => {
    const invalidUserId = 0;
    const invalidInsertionId = 2;

    // Imposta il mock per rifiutare la Promise se i parametri non sono validi
    pool.query.mockImplementation((query, params) => {
      if (params[0] >= 1 && params[1] >= 1) {
        return Promise.resolve({ rows: [fakeRow] });
      }
      return Promise.reject(new Error("Parametri non validi"));
    });

    await expect(removeFavorite(invalidUserId, invalidInsertionId))
      .rejects.toThrow('Parametri non validi');
  });
});



describe('updateProfile N-Wect', () => {


  console.log("userId:\n 1) CEuId1 = userId >= 1 (valid) \n 2) CEuId2 = userId < 1 (not valid)");
  console.log("password:\n 1) CEpass1 = lunghezza >= 5 && prima lettera maiuscola && contiene un numero (valid)\n 2) CEpass2 = null (not valid)\n 3) CEpass3 = vuota (not valid)\n"
  + " 4) CEpass4 = qualisasi stringa diversa dai casi precedenti (not valid)");
  console.log("phone:\n 1) CEphone1 = lunghezza = 10 (valid)\n 2) CEphone2 = null (valid)\n 3) CEphone3 = vuota (valid)\n"
  + " 4) CEphone4 = qualisasi stringa diversa dai casi precedenti (not valid)");



  test('N-Wect con copertura su classi CEuId1, CEpass1 e CEphone3 : deve modificare il profilo correttamente', async () => {
    const validUserId = 1;
    const validPassword = "Newpassword1";
    const validPhone = "";
    const fakeRow = { userid: validUserId, newPassword: validPassword, newPhone: validPhone };

    // Imposta il mock per gestire i parametri validi
    pool.query.mockImplementation((query, params) => {
      const [userId, password, phone] = params;

      if (userId < 1) {
        return Promise.reject(new Error("Parametro Id non valido"));
      }
      
      if (
        !password || 
        password.length < 5 || 
        password.charAt(0) !== password.charAt(0).toUpperCase() || 
        !/\d/.test(password) 
      ) {
        return Promise.reject(new Error("Parametro password non valido"));
      }

      // Controllo phone (CEphone: valido se è null, vuoto o di lunghezza 10)
      if (phone !== null && phone !== "" && phone.length !== 10) {
        return Promise.reject(new Error("Parametro phone non valido"));
      }

      // Simula il risultato della query
      return Promise.resolve({
        rows: [
          {
            id: userId,
            first_name: "Mario",
            last_name: "Rossi",
            email: "mario.rossi@example.com",
            phone: phone,
            role: "user",
          },
        ],
      });
    });

    const result = await updateProfile(validUserId, validPassword, validPhone);
    expect(result).toEqual(
      expect.objectContaining({
        id: validUserId,
        phone: validPhone, 
      })
    );
  });

  test('N-Wect con copertura su classi CEuId1, CEpass4 e CEphone3 : non deve modificare il profilo a causa della password invalida', async () => {
    const validUserId = 1;
    const invalidPassword = "Abc";
    const validPhone = "";
    const fakeRow = { userid: validUserId, newPassword: invalidPassword, newPhone: validPhone };

    // Imposta il mock per gestire i parametri validi
    pool.query.mockImplementation((query, params) => {
      const [userId, password, phone] = params;

      if (userId < 1) {
        return Promise.reject(new Error("Parametro Id non valido"));
      }
      
      if (
        !password || 
        password.length < 5 || 
        password.charAt(0) !== password.charAt(0).toUpperCase() || 
        !/\d/.test(password) 
      ) {
        return Promise.reject(new Error("Parametro password non valido"));
      }

      // Controllo phone (CEphone: valido se è null, vuoto o di lunghezza 10)
      if (phone !== null && phone !== "" && phone.length !== 10) {
        return Promise.reject(new Error("Parametro phone non valido"));
      }

      // Simula il risultato della query
      return Promise.resolve({
        rows: [
          {
            id: userId,
            first_name: "Mario",
            last_name: "Rossi",
            email: "mario.rossi@example.com",
            phone: phone,
            role: "user",
          },
        ],
      });
    });

    await expect(updateProfile(validUserId, invalidPassword, validPhone)).rejects.toThrow('Parametro password non valido');
  });

  test('N-Wect con copertura su classi CEuId1, CEpass1 e CEphone4 : non deve modificare il profilo a causa del numero di telefono invalida', async () => {
    const validUserId = 1;
    const validPassword = "Password1";
    const invalidPhone = "12345";
    const fakeRow = { userid: validUserId, newPassword: validPassword, newPhone: invalidPhone };

    // Imposta il mock per gestire i parametri validi
    pool.query.mockImplementation((query, params) => {
      const [userId, password, phone] = params;

      if (userId < 1) {
        return Promise.reject(new Error("Parametro Id non valido"));
      }
      
      if (
        !password || 
        password.length < 5 || 
        password.charAt(0) !== password.charAt(0).toUpperCase() || 
        !/\d/.test(password) 
      ) {
        return Promise.reject(new Error("Parametro password non valido"));
      }

      // Controllo phone (CEphone: valido se è null, vuoto o di lunghezza 10)
      if (phone !== null && phone !== "" && phone.length !== 10) {
        return Promise.reject(new Error("Parametro phone non valido"));
      }

      // Simula il risultato della query
      return Promise.resolve({
        rows: [
          {
            id: userId,
            first_name: "Mario",
            last_name: "Rossi",
            email: "mario.rossi@example.com",
            phone: phone,
            role: "user",
          },
        ],
      });
    });

    await expect(updateProfile(validUserId, validPassword, invalidPhone)).rejects.toThrow('Parametro phone non valido');
  });

  test('N-Wect con copertura su classi CEuId1, CEpass1 e CEphone1 : deve modificare il profilo correttamente', async () => {
    const validUserId = 1;
    const validPassword = "Newpassword1";
    const validPhone = "0123456789";
    const fakeRow = { userid: validUserId, newPassword: validPassword, newPhone: validPhone };

    // Imposta il mock per gestire i parametri validi
    pool.query.mockImplementation((query, params) => {
      const [userId, password, phone] = params;

      if (userId < 1) {
        return Promise.reject(new Error("Parametro Id non valido"));
      }
      
      if (
        !password || 
        password.length < 5 || 
        password.charAt(0) !== password.charAt(0).toUpperCase() || 
        !/\d/.test(password) 
      ) {
        return Promise.reject(new Error("Parametro password non valido"));
      }

      // Controllo phone (CEphone: valido se è null, vuoto o di lunghezza 10)
      if (phone !== null && phone !== "" && phone.length !== 10) {
        return Promise.reject(new Error("Parametro phone non valido"));
      }

      // Simula il risultato della query
      return Promise.resolve({
        rows: [
          {
            id: userId,
            first_name: "Mario",
            last_name: "Rossi",
            email: "mario.rossi@example.com",
            phone: phone,
            role: "user",
          },
        ],
      });
    });

    const result = await updateProfile(validUserId, validPassword, validPhone);
    expect(result).toEqual(
      expect.objectContaining({
        id: validUserId,
        phone: validPhone, 
      })
    );
  });
});
