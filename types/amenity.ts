export interface Amenity {
  id: string; // Unique identifier
  name: string; // Name of the amenity
  description?: string; // Description of the amenity
  createdAt?: Date; // Creation timestamp
  updatedAt?: Date; // Last updated timestamp
}
