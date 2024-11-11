import { Property } from "./property";

export interface Category {
  id: string; // Unique identifier
  name: string; // Name of the category
  description: string; // Description of the category
  properties: Property[]; // Related properties
  createdAt: Date; // Creation timestamp
  updatedAt: Date; // Last updated timestamp
}
