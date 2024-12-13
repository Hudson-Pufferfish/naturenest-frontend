import { Amenity } from "./amenity";
import { Category } from "./category";
import { Reservation } from "./reservation";
import { User } from "./user";

export interface Property {
  id: string; // Unique identifier
  name: string; // Property name
  tagLine: string; // Tagline for the property
  categoryId: string; // ID of the category
  category?: Category; // Related category object
  description: string; // Description of the property
  coverUrl: string; // URL for the cover image
  price: number; // Price of the property
  guests: number; // Number of guests the property can accommodate
  bedrooms: number; // Number of bedrooms
  beds: number; // Number of beds
  baths: number; // Number of baths
  creatorId: string; // ID of the creator
  creator: User; // Related user object representing the creator
  createdAt: Date; // Creation timestamp
  updatedAt: Date; // Last updated timestamp
  countryCode: string; // Related country object cca2 format
  amenities: Amenity[] | []; // Optional array of amenities
}

export interface PropertyWithDetails extends Property {
  reservations: Reservation[]; // Related reservations
  totalNightsBooked: number; // Total nights booked
  totalIncome: number; // Total income
}

export type PropertyCardProps = Pick<Property, "id" | "coverUrl" | "name" | "price" | "countryCode" | "tagLine">;
