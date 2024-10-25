// auth.d.ts
declare module '#auth-utils' {
  interface User {
    userId: number; // Instead of `user: number`, specify `userId`
  }

  interface UserSession {
    // Add any fields relevant to the session here, if needed
  }

  interface SecureSessionData {
    // Add any fields for secure session data here, if needed
  }
}

export {};
