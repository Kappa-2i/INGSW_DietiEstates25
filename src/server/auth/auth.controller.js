const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authRepository = require('../repositories/auth.repository');

/**
 * Registra un nuovo utente.
 * @param {Object} req - La richiesta HTTP contenente i dati dell'utente.
 * @param {Object} res - La risposta HTTP.
 * @returns {void}
 */
exports.register = async (req, res) => {
  
    const { email, password, role, first_name, last_name, phone } = req.body;
  
    try {
      // Controlla se l'utente esiste già
      const existingUser = await authRepository.findByEmail(email);
      if (existingUser) {
        return res.status(400).json({ success: false, message: 'Utente già registrato. Riprova!' });
      }
  
      // Hash della password
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Crea il nuovo utente
      const newUser = await authRepository.createUser(email, hashedPassword, role, first_name, last_name, phone);
  
      res.status(201).json({ success: true, data: newUser });
    } catch (err) {
      console.error('Errore durante la registrazione:', err.message);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  };


/**
 * Effettua il login di un utente.
 * @param {Object} req - La richiesta HTTP contenente email e password.
 * @param {Object} res - La risposta HTTP.
 * @returns {void}
 */
exports.login = async (req, res) => {
  const { email, password } = req.body;
  try{
    const user = await authRepository.findByEmail(email);
    if(!user) {
      return res.status(400).json({ success: false, message: 'Credenziali non valide' });
    }

    //Verifica della password
    const isMatch = await bcrypt.compare(password,user.password);
    if(!isMatch) {
      return res.status(400).json({ success: false, message: 'Credenziali non valide' });
    }

    //Crea token JWT
    const token = jwt.sign({ id: user.id, role: user.role, password: user.password }, process.env.JWT_SECRET, { expiresIn: '3h' });
    res.status(200).json({ success: true, token });
  }catch(err){
    console.err('Errore durante il login:', err.message);
    res.status(500).json({ success: false , message: 'Errore interno del server' });
  }
};

/**
 * Callback per l'autenticazione con Google.
 * @param {Object} req - La richiesta HTTP, contenente l'utente autenticato.
 * @param {Object} res - La risposta HTTP per reindirizzare l'utente.
 * @returns {void}
 */
exports.googleCallback = (req, res) => {
  // Assumendo che req.user sia già impostato da Passport
  const token = jwt.sign(
    { id: req.user.id, role: req.user.role },
    process.env.JWT_SECRET,
    { expiresIn: '3h' }
  );
  
  // Reindirizza alla pagina di successo passando il token nella query string
  res.redirect(`http://localhost:3000/auth/success?token=${token}`);
};

/**
 * Effettua il logout di un utente.
 * @param {Object} req - La richiesta HTTP.
 * @param {Object} res - La risposta HTTP con il messaggio di conferma logout.
 * @returns {void}
 */
exports.logout = (req, res) => {
  res.status(200).json({ success: true, message: 'Logged out successfully' });
};
