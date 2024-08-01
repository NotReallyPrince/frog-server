import { IAdmin } from "../v2/models/admin.model";


// Extend the Express namespace
declare global {
  namespace Express {
    // Add Passport.js properties to Request
    interface Request {
      logIn(user: IAdmin, done: (err: any) => void): void;
      login(user: IAdmin, done: (err: any) => void): void;
      logOut(done: (err: any) => void): void;
      logout(done: (err: any) => void): void;
      isAuthenticated(): boolean;
      isUnauthenticated(): boolean;
      user?: IAdmin; // This should match your user model interface
    }

    // Extend User to include your custom properties
    interface User extends IAdmin {}
  }
}

// Required for TypeScript to treat this file as a module
export {};
