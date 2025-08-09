import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as GitHubStrategy } from 'passport-github2';
import User from '../models/User.js';

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id).lean();
    done(null, user || null);
  } catch (e) {
    done(e);
  }
});

async function upsertUserFromOAuth({ provider, profile }) {
  const providerId = profile.id;
  const email = profile.emails?.[0]?.value ? profile.emails[0].value.toLowerCase() : null;
  const name = profile.displayName || profile.username || '';
  const avatar = profile.photos?.[0]?.value || '';

  const query = email ? { email } : { providers: { $elemMatch: { provider, providerId } } };
  const existing = await User.findOne(query);

  if (existing) {
    const hasLink = existing.providers.some((p) => p.provider === provider && p.providerId === providerId);
    if (!hasLink) {
      existing.providers.push({ provider, providerId });
      if (!existing.avatar && avatar) existing.avatar = avatar;
      if (!existing.name && name) existing.name = name;
      await existing.save();
    }
    return existing;
  }

  const user = await User.create({
    email: email || undefined,
    name,
    avatar,
    providers: [{ provider, providerId }],
    roles: ['user']
  });
  return user;
}

passport.use(new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      const user = await upsertUserFromOAuth({ provider: 'google', profile });
      done(null, user);
    } catch (e) {
      done(e);
    }
  }
));

passport.use(new GitHubStrategy(
  {
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: process.env.GITHUB_CALLBACK_URL,
    scope: ['user:email']
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      const user = await upsertUserFromOAuth({ provider: 'github', profile });
      done(null, user);
    } catch (e) {
      done(e);
    }
  }
));