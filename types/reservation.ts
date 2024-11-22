import { Property } from "./property";
import { User } from "./user";

export interface Reservation {
  id: string; // Unique identifier
  propertyId: string; // ID of the reserved property
  property: Property; // Related property object
  userId: string; // ID of the user who made the reservation
  user: User; // Related user object
  totalPrice: number; // Total price for the reservation
  startDate: string; // Start date of the reservation
  endDate: string; // End date of the reservation
  createdAt: Date; // Creation timestamp
  updatedAt: Date; // Last updated timestamp
  numberOfGuests: number; // Number of guests
}
