const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const userRepository = require('../repositories/user.repository');

/**
 * Configurazione della strategia di autenticazione con Google.
 * @constant {GoogleStrategy} - Strategia OAuth 2.0 per Google.
 */
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,         
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      // Cerca l'utente tramite googleId
      let user = await userRepository.findByGoogleId(profile.id);

      // Se non esiste, cerca un utente con la stessa email
      if (!user) {
        user = await userRepository.findByEmail(profile.emails[0].value);
      }

      // Se l'utente esiste, viene aggiunto il googleId
      if (user && !user.googleId) {
        user = await userRepository.updateGoogleUser(user.id, profile.id);
      }

      // Se l'utente non esiste viene creato
      if (!user) {
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
