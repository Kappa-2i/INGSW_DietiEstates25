const { removeFavorite } = require('../repositories/favorite.repository');
const { updateProfile, createAgent } = require('../repositories/user.repository');
const pool = require('../config/db'); 

jest.mock('../config/db', () => ({
  query: jest.fn(),
}));

describe('createAgent N-Wect', () => {


  console.log("first_name:\n 1) CEfn1 = Stringa (valid)\n 2) CEfn2 = null (not valid)\n 3) CEfn3 = Stringa vuota (not valid)\n");
  console.log("last_name:\n 1) CEln1 = Stringa (valid)\n 2) CEln2 = null (not valid)\n 3) CEln3 = Stringa vuota (not valid)\n");
  console.log("email:\n 1) CEemail1 = Stringa contiene una @ e un . (valid)\n 2) CEemail2 = null (not valid)\n 3) CEemail3 = Stringa vuota (not valid)\n 4) CEemail4 = Stringa già esistente (not valid)\n 5) CEemail5 = Qualsiasi stringa diversa dai casi precedenti\n");
  console.log("password:\n 1) CEpass1 = lunghezza >= 5 && prima lettera maiuscola && contiene un numero (valid)\n 2) CEpass2 = null (not valid)\n 3) CEpass3 = vuota (not valid)\n"
  + " 4) CEpass4 = qualisasi stringa diversa dai casi precedenti (not valid)");
  console.log("phone:\n 1) CEphone1 = lunghezza = 10 (valid)\n 2) CEphone2 = null (valid)\n 3) CEphone3 = vuota (valid)\n"
  + " 4) CEphone4 = qualisasi stringa diversa dai casi precedenti (not valid)");
  console.log("supervisorId:\n 1) CEsupId1 = supId >= 1 (valid)\n 2) CEsupId1 = supId < 1 (not valid)\n");
  console.log("role:\n 1) CErole1 = 'AGENT' (valid)\n 2) CErole2 = 'MANAGER' (valid) \n 3) CErole3 = null (not valid)\n 4) CErole4 = Stringa vuota (not valid)\n 5) CErole5 = Qualsiasi stringa diversa dai casi precedenti (not valid)\n");
  console.log("---------------------------------------");


  test('N-Wect con copertura su classi CEfn1, CEln1, CEemail1, CEpass1, CEphone1, CEsupId1 e CErole1: deve creare un agente con successo', async () => {

      // Parametri validi (copertura classi di equivalenza valide)
      const first_name = "Mario";               // CEfn1
      const last_name = "Rossi";                // CEln1
      const email = "mario.rossi@example.com";  // CEemail1
      const password = "Password1";             // CEpass1
      const phone = "3331234567";               // CEphone1
      const supervisorId = 1;                   // CEsupId1
      const role = "AGENT";                    // CErole1
  
      // Oggetto risultato atteso
      const fakeRow = {
        id: 1,
        first_name,
        last_name,
        email,
        phone,
        role,
        supervisor: supervisorId
      };

      pool.query.mockImplementation((query, params) => {
        const [fn, ln, em, pw, ph, rl, supId] = params;
        // Controllo first_name (CEfn1)
        if (!fn) {
          return Promise.reject(new Error('Invalid first_name'));
        }
  
        // Controllo last_name (CEln1)
        if (!ln) {
          return Promise.reject(new Error('Invalid last_name'));
        }
  
        // Controllo email (CEemail1)
        if (!em.includes('@') || !em.includes('.')) {
          return Promise.reject(new Error('Invalid email'));
        }
  
        // Controllo password (CEpass1)
        if (
          !pw || 
          pw.length < 5 || 
          pw.charAt(0) !== pw.charAt(0).toUpperCase() || 
          !/\d/.test(pw) 
        ) {
          return Promise.reject(new Error("Parametro password non valido"));
        }
  
        // Controllo phone (CEphone1, CEphone2, CEphone3 validi)
        if (!ph || ph.length !== 10 || !/^\d{10}$/.test(ph)) {
          return Promise.reject(new Error("Parametro phone non valido"));
        }
  
        // Controllo supervisorId (CEsupId1)
        if (supId < 1) {
          return Promise.reject(new Error('Invalid supervisorId'));
        }
  
        // Controllo role (CErole1, CErole2)
        if (rl !== 'AGENT' && rl !== 'MANAGER') {
          return Promise.reject(new Error('Invalid role'));
        }
  
        // Se tutti validi, ritorna la riga finta
        return Promise.resolve({ rows: [fakeRow] });
      });

    const result = await createAgent(first_name, last_name, email, password, phone, supervisorId, role);
    expect(result).toEqual(expect.objectContaining(fakeRow));
    
  });


  test('N-Wect con copertura su classi CEfn3, CEln1, CEemail1, CEpass1, CEphone1, CEsupId1 e CErole1: non deve creare un agente a causa del nome non valido', async () => {

    // Parametri validi (copertura classi di equivalenza valide)
    const first_name = "";                    // CEfn3
    const last_name = "Rossi";                // CEln1
    const email = "mario.rossi@example.com";  // CEemail1
    const password = "Password1";             // CEpass1
    const phone = "3331234567";               // CEphone1
    const supervisorId = 1;                   // CEsupId1
    const role = "AGENT";                     // CErole1

    // Oggetto risultato atteso
    const fakeRow = {
      id: 1,
      first_name,
      last_name,
      email,
      phone,
      role,
      supervisor: supervisorId
    };

    pool.query.mockImplementation((query, params) => {
      const [fn, ln, em, pw, ph, rl, supId] = params;

      // Controlli di validità sui parametri

      // Controllo first_name (CEfn1)
      if (!fn) {
        return Promise.reject(new Error('Parametro Nome non valido'));
      }

      // Controllo last_name (CEln1)
      if (!ln) {
        return Promise.reject(new Error('Parametro Cognome non valido'));
      }

      // Controllo email (CEemail1)
      if (!em.includes('@') || !em.includes('.')) {
        return Promise.reject(new Error('Parametro Email non valido'));
      }

      // Controllo password (CEpass1)
      if (
        !pw || 
        pw.length < 5 || 
        pw.charAt(0) !== pw.charAt(0).toUpperCase() || 
        !/\d/.test(pw) 
      ) {
        return Promise.reject(new Error("Parametro password non valido"));
      }

      // Controllo phone (CEphone1, CEphone2, CEphone3 validi)
      if (!ph || ph.length !== 10 || !/^\d{10}$/.test(ph)) {
        return Promise.reject(new Error("Parametro phone non valido"));
      }

      // Controllo supervisorId (CEsupId1)
      if (supId < 1) {
        return Promise.reject(new Error('Parametro SupervisorId non valido'));
      }

      // Controllo role (CErole1, CErole2)
      if (rl !== 'AGENT' && rl !== 'MANAGER') {
        return Promise.reject(new Error('Parametro Ruolo non valido'));
      }

      // Se tutti validi, ritorna la riga finta
      return Promise.resolve({ rows: [fakeRow] });
    });

  await expect(createAgent(first_name, last_name, email, password, phone, supervisorId, role)).rejects.toThrow('Parametro Nome non valido');
  
});


test('N-Wect con copertura su classi CEfn1, CEln3, CEemail1, CEpass1, CEphone1, CEsupId1 e CErole1: non deve creare un agente a causa del cognome non valido', async () => {

  // Parametri validi (copertura classi di equivalenza valide)
  const first_name = "Mario";               // CEfn1
  const last_name = "";                     // CEln3
  const email = "mario.rossi@example.com";  // CEemail1
  const password = "Password1";             // CEpass1
  const phone = "3331234567";               // CEphone1
  const supervisorId = 1;                   // CEsupId1
  const role = "AGENT";                    // CErole1

  // Oggetto risultato atteso
  const fakeRow = {
    id: 1,
    first_name,
    last_name,
    email,
    phone,
    role,
    supervisor: supervisorId
  };

  pool.query.mockImplementation((query, params) => {
    const [fn, ln, em, pw, ph, rl, supId] = params;

    // Controlli di validità sui parametri

    // Controllo first_name (CEfn1)
    if (!fn) {
      return Promise.reject(new Error('Parametro Nome non valido'));
    }

    // Controllo last_name (CEln1)
    if (!ln) {
      return Promise.reject(new Error('Parametro Cognome non valido'));
    }

    // Controllo email (CEemail1)
    if (!em.includes('@') || !em.includes('.')) {
      return Promise.reject(new Error('Parametro Email non valido'));
    }

    // Controllo password (CEpass1)
    if (
      !pw || 
      pw.length < 5 || 
      pw.charAt(0) !== pw.charAt(0).toUpperCase() || 
      !/\d/.test(pw) 
    ) {
      return Promise.reject(new Error("Parametro password non valido"));
    }

    // Controllo phone (CEphone1, CEphone2, CEphone3 validi)
    if (!ph || ph.length !== 10 || !/^\d{10}$/.test(ph)) {
      return Promise.reject(new Error("Parametro phone non valido"));
    }

    // Controllo supervisorId (CEsupId1)
    if (supId < 1) {
      return Promise.reject(new Error('Parametro SupervisorId non valido'));
    }

    // Controllo role (CErole1, CErole2)
    if (rl !== 'AGENT' && rl !== 'MANAGER') {
      return Promise.reject(new Error('Parametro Ruolo non valido'));
    }

    // Se tutti validi, ritorna la riga finta
    return Promise.resolve({ rows: [fakeRow] });
  });

await expect(createAgent(first_name, last_name, email, password, phone, supervisorId, role)).rejects.toThrow('Parametro Cognome non valido');

});

test('N-Wect con copertura su classi CEfn1, CEln1, CEemail5, CEpass1, CEphone1, CEsupId1 e CErole1: non deve creare un agente a causa dell email non valido', async () => {

  const first_name = "Mario";               // CEfn1
  const last_name = "Rossi";                // CEln1
  const email = "mario.rossi";              // CEemail5
  const password = "Password1";             // CEpass1
  const phone = "3331234567";               // CEphone1
  const supervisorId = 1;                   // CEsupId1
  const role = "AGENT";                    // CErole1

  // Oggetto risultato atteso
  const fakeRow = {
    id: 1,
    first_name,
    last_name,
    email,
    phone,
    role,
    supervisor: supervisorId
  };

  pool.query.mockImplementation((query, params) => {
    const [fn, ln, em, pw, ph, rl, supId] = params;

    // Controlli di validità sui parametri

    // Controllo first_name (CEfn1)
    if (!fn) {
      return Promise.reject(new Error('Parametro Nome non valido'));
    }

    // Controllo last_name (CEln1)
    if (!ln) {
      return Promise.reject(new Error('Parametro Cognome non valido'));
    }

    // Controllo email (CEemail1)
    if (!em.includes('@') || !em.includes('.')) {
      return Promise.reject(new Error('Parametro Email non valido'));
    }

    // Controllo password (CEpass1)
    if (
      !pw || 
      pw.length < 5 || 
      pw.charAt(0) !== pw.charAt(0).toUpperCase() || 
      !/\d/.test(pw) 
    ) {
      return Promise.reject(new Error("Parametro password non valido"));
    }

    // Controllo phone (CEphone1, CEphone2, CEphone3 validi)
    if (!ph || ph.length !== 10 || !/^\d{10}$/.test(ph)) {
      return Promise.reject(new Error("Parametro phone non valido"));
    }

    // Controllo supervisorId (CEsupId1)
    if (supId < 1) {
      return Promise.reject(new Error('Parametro SupervisorId non valido'));
    }

    // Controllo role (CErole1, CErole2)
    if (rl !== 'AGENT' && rl !== 'MANAGER') {
      return Promise.reject(new Error('Parametro Ruolo non valido'));
    }

    // Se tutti validi, ritorna la riga finta
    return Promise.resolve({ rows: [fakeRow] });
  });

await expect(createAgent(first_name, last_name, email, password, phone, supervisorId, role)).rejects.toThrow('Parametro Email non valido');

});


test('N-Wect con copertura su classi CEfn1, CEln1, CEemail1, CEpass4, CEphone1, CEsupId1 e CErole1: non deve creare un agente a causa del password non valido', async () => {

  const first_name = "Mario";               // CEfn1
  const last_name = "Rossi";                // CEln1
  const email = "mario.rossi@example.com";  // CEemail1
  const password = "Pass";                  // CEpass4
  const phone = "3331234567";               // CEphone1
  const supervisorId = 1;                   // CEsupId1
  const role = "AGENT";                    // CErole1

  // Oggetto risultato atteso
  const fakeRow = {
    id: 1,
    first_name,
    last_name,
    email,
    phone,
    role,
    supervisor: supervisorId
  };

  pool.query.mockImplementation((query, params) => {
    const [fn, ln, em, pw, ph, rl, supId] = params;

    // Controlli di validità sui parametri

    // Controllo first_name (CEfn1)
    if (!fn) {
      return Promise.reject(new Error('Parametro Nome non valido'));
    }

    // Controllo last_name (CEln1)
    if (!ln) {
      return Promise.reject(new Error('Parametro Cognome non valido'));
    }

    // Controllo email (CEemail1)
    if (!em.includes('@') || !em.includes('.')) {
      return Promise.reject(new Error('Parametro Email non valido'));
    }

    // Controllo password (CEpass1)
    if (
      !pw || 
      pw.length < 5 || 
      pw.charAt(0) !== pw.charAt(0).toUpperCase() || 
      !/\d/.test(pw) 
    ) {
      return Promise.reject(new Error("Parametro password non valido"));
    }

    // Controllo phone (CEphone1, CEphone2, CEphone3 validi)
    if (!ph || ph.length !== 10 || !/^\d{10}$/.test(ph)) {
      return Promise.reject(new Error("Parametro phone non valido"));
    }

    // Controllo supervisorId (CEsupId1)
    if (supId < 1) {
      return Promise.reject(new Error('Parametro SupervisorId non valido'));
    }

    // Controllo role (CErole1, CErole2)
    if (rl !== 'AGENT' && rl !== 'MANAGER') {
      return Promise.reject(new Error('Parametro Ruolo non valido'));
    }

    // Se tutti validi, ritorna la riga finta
    return Promise.resolve({ rows: [fakeRow] });
  });

await expect(createAgent(first_name, last_name, email, password, phone, supervisorId, role)).rejects.toThrow('Parametro password non valido');

});


test('N-Wect con copertura su classi CEfn1, CEln1, CEemail1, CEpass1, CEphone4, CEsupId1 e CErole1: non deve creare un agente a causa del telefono non valido', async () => {


  const first_name = "Mario";               // CEfn1
  const last_name = "Rossi";                // CEln1
  const email = "mario.rossi@example.com";  // CEemail1
  const password = "Password1";             // CEpass1
  const phone = "12345";                    // CEphone4
  const supervisorId = 1;                   // CEsupId1
  const role = "AGENT";                    // CErole1

  // Oggetto risultato atteso
  const fakeRow = {
    id: 1,
    first_name,
    last_name,
    email,
    phone,
    role,
    supervisor: supervisorId
  };

  pool.query.mockImplementation((query, params) => {
    const [fn, ln, em, pw, ph, rl, supId] = params;

    // Controlli di validità sui parametri

    // Controllo first_name (CEfn1)
    if (!fn) {
      return Promise.reject(new Error('Parametro Nome non valido'));
    }

    // Controllo last_name (CEln1)
    if (!ln) {
      return Promise.reject(new Error('Parametro Cognome non valido'));
    }

    // Controllo email (CEemail1)
    if (!em.includes('@') || !em.includes('.')) {
      return Promise.reject(new Error('Parametro Email non valido'));
    }

    // Controllo password (CEpass1)
    if (
      !pw || 
      pw.length < 5 || 
      pw.charAt(0) !== pw.charAt(0).toUpperCase() || 
      !/\d/.test(pw) 
    ) {
      return Promise.reject(new Error("Parametro password non valido"));
    }

    // Controllo phone (CEphone1, CEphone2, CEphone3 validi)
    if (!ph || ph.length !== 10 || !/^\d{10}$/.test(ph)) {
      return Promise.reject(new Error("Parametro phone non valido"));
    }

    // Controllo supervisorId (CEsupId1)
    if (supId < 1) {
      return Promise.reject(new Error('Parametro SupervisorId non valido'));
    }

    // Controllo role (CErole1, CErole2)
    if (rl !== 'AGENT' && rl !== 'MANAGER') {
      return Promise.reject(new Error('Parametro Ruolo non valido'));
    }

    // Se tutti validi, ritorna la riga finta
    return Promise.resolve({ rows: [fakeRow] });
  });

await expect(createAgent(first_name, last_name, email, password, phone, supervisorId, role)).rejects.toThrow('Parametro phone non valido');

});


test('N-Wect con copertura su classi CEfn1, CEln1, CEemail1, CEpass1, CEphone1, CEsupId1 e CErole3: non deve creare un agente a causa del ruolo non valido', async () => {


  const first_name = "Mario";               // CEfn1
  const last_name = "Rossi";                // CEln1
  const email = "mario.rossi@example.com";  // CEemail1
  const password = "Password1";             // CEpass1
  const phone = "3331234567";               // CEphone1
  const supervisorId = 1;                   // CEsupId1
  const role = "ruolo";                    // CErole3

  // Oggetto risultato atteso
  const fakeRow = {
    id: 1,
    first_name,
    last_name,
    email,
    phone,
    role,
    supervisor: supervisorId
  };

  pool.query.mockImplementation((query, params) => {
    const [fn, ln, em, pw, ph, rl, supId] = params;

    // Controlli di validità sui parametri

    // Controllo first_name (CEfn1)
    if (!fn) {
      return Promise.reject(new Error('Parametro Nome non valido'));
    }

    // Controllo last_name (CEln1)
    if (!ln) {
      return Promise.reject(new Error('Parametro Cognome non valido'));
    }

    // Controllo email (CEemail1)
    if (!em.includes('@') || !em.includes('.')) {
      return Promise.reject(new Error('Parametro Email non valido'));
    }

    // Controllo password (CEpass1)
    if (
      !pw || 
      pw.length < 5 || 
      pw.charAt(0) !== pw.charAt(0).toUpperCase() || 
      !/\d/.test(pw) 
    ) {
      return Promise.reject(new Error("Parametro password non valido"));
    }

    // Controllo phone (CEphone1, CEphone2, CEphone3 validi)
    if (!ph || ph.length !== 10 || !/^\d{10}$/.test(ph)) {
      return Promise.reject(new Error("Parametro phone non valido"));
    }

    // Controllo supervisorId (CEsupId1)
    if (supId < 1) {
      return Promise.reject(new Error('Parametro SupervisorId non valido'));
    }

    // Controllo role (CErole1, CErole2)
    if (rl !== 'AGENT' && rl !== 'MANAGER') {
      return Promise.reject(new Error('Parametro Ruolo non valido'));
    }

    // Se tutti validi, ritorna la riga finta
    return Promise.resolve({ rows: [fakeRow] });
  });

await expect(createAgent(first_name, last_name, email, password, phone, supervisorId, role)).rejects.toThrow('Parametro Ruolo non valido');

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

