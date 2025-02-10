const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authRepository = require('../repositories/auth.repository');

// Registrazione di un nuovo utente
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
      console.error('Error during registration:', err.message);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  };


//Login di un utente
exports.login = async (req, res) => {
  const { email, password } = req.body;
  try{
    //Cerca se esiste già l'utente
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

// Logout di un utente
exports.logout = (req, res) => {
  // Non c'è nulla da fare lato server per il logout
  res.status(200).json({ success: true, message: 'Logged out successfully' });
};