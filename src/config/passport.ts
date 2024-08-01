import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { AdminModel, IAdmin } from '../v2/models/admin.model';


// Configure Passport Local Strategy
passport.use(new LocalStrategy(
  async (username: string, password: string, done) => {
    try {
      const user = await AdminModel.findOne({ username });

      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }

      const isMatch = await user.comparePassword(password);

      if (!isMatch) {
        return done(null, false, { message: 'Incorrect password.' });
      }

      return done(null, user);
    } catch (error) {
      return done(error);
    }
  }
));

// Serialize user to store user ID in session
passport.serializeUser((user: IAdmin, done) => {
  done(null, user.id);
});

// Deserialize user by retrieving user details from session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await AdminModel.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

export default passport;
