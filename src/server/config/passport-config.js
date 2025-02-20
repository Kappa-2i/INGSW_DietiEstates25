const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const userRepository = require('../repositories/user.repository');

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,         
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/api/auth/google/callback'
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      // Prova a cercare l'utente tramite googleId
      let user = await userRepository.findByGoogleId(profile.id);

      // Se non lo trovi, potresti voler controllare se esiste un utente con la stessa email
      if (!user) {
        user = await userRepository.findByEmail(profile.emails[0].value);
      }

      // Se l'utente esiste, ma non ha il googleId, puoi aggiornare il record
      if (user && !user.googleId) {
        user = await userRepository.updateGoogleUser(user.id, { googleId: profile.id });
      }

      // Se l'utente non esiste, crealo
      if (!user) {
        // Nota: per un utente creato tramite Google potresti non avere una password,
        // quindi imposta il campo password a null o a una stringa vuota (a seconda della logica della tua applicazione)
        const newUserData = {
          first_name: profile.name.givenName,
          last_name: profile.name.familyName,
          email: profile.emails[0].value,
          googleId: profile.id,
          password: 'googlepassword',
          phone: null,
          role: 'USER'
        };

        user = await userRepository.createGoogleUser(newUserData);
      }

      return done(null, user);
    } catch (err) {
      return done(err, null);
    }
  }
));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await userRepository.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

module.exports = passport;
