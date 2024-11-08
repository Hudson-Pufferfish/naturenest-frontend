import { Property } from "./property";
import { Reservation } from "./reservation";

export interface User {
  id: string; // Unique identifier
  email: string; // Unique email address
  username: string; // Unique username
  password: string; // Hashed password
  firstName?: string; // Optional first name
  lastName?: string; // Optional last name
  createdAt: Date; // Creation timestamp
  updatedAt: Date; // Last updated timestamp
  properties: Property[]; // Related properties
  reservations: Reservation[]; // Related reservations
}
