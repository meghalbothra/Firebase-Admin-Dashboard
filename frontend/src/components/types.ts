// src/types.ts
export interface User {
    uid: string; // Use consistent naming
    email: string;
    creation_time: number | null;
    role?: string; // Optional if not used everywhere
  }
  