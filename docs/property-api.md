# Property API

## Authentication

All endpoints require authentication except:

- GET /v1/properties (list properties)
- GET /v1/properties/:propertyId (get public property details)

Include JWT token in headers:

```
headers: {
Authorization: Bearer ${token}
}
```

## Types

```
type Property = {
id: string;
name: string; // max 20 chars
tagLine: string; // max 30 chars
description: string;
price: number;
coverUrl: string;
guests: number;
bedrooms: number;
beds: number;
baths: number;
countryCode: string; // ISO 3166-1 alpha-2 (e.g., "US")
category: {
id: string;
name: string;
description: string;
};
amenities: Array<{
id: string;
name: string;
description: string;
}>;
creator: {
id: string;
username: string;
};
};
type OwnerPropertyDetails = Property & {
totalNightsBooked: number;
totalIncome: number;
reservations: Array<{
id: string;
startDate: string; // YYYY-MM-DD
endDate: string; // YYYY-MM-DD
totalPrice: number;
numberOfGuests: number;
user: {
id: string;
username: string;
email: string;
};
}>;
};
```

## Endpoints

### List Properties

```
GET /v1/properties
// Query Parameters
interface ListPropertiesParams {
skip?: number; // default: 0
take?: number; // default: 10
categoryName?: string; // filter by category
propertyName?: string; // search by name
}
// Response: Property[]
```

### Create Property

```
POST /v1/properties
// Request Body
interface CreatePropertyRequest {
name: string;
tagLine: string;
description: string;
price: number;
categoryId: string;
coverUrl: string;
guests: number;
bedrooms: number;
beds: number;
baths: number;
countryCode: string;
amenityIds?: string[];
}
// Response: Property
```

### Get My Properties

```
GET /v1/properties/my
// Query Parameters
interface MyPropertiesParams {
skip?: number; // default: 0
take?: number; // default: 10
}
// Response: OwnerPropertyDetails[]
```

### Get Property Details

```
GET /v1/properties/:propertyId // Public details
GET /v1/properties/:propertyId/full // Full details (owner only)
// Response: Property or OwnerPropertyDetails
```

### Update Property

```
PATCH /v1/properties/:propertyId
// Request Body: Partial<CreatePropertyRequest>
// Response: Property
```

### Delete Property

```
DELETE /v1/properties/:propertyId
// Response: Property
```

## Example Implementation

### React Query Hooks

```
// hooks/useProperties.ts
export const useProperties = (params?: ListPropertiesParams) => {
return useQuery({
queryKey: ['properties', params],
queryFn: () => axios.get('/v1/properties', { params })
});
};
export const useMyProperties = (params?: MyPropertiesParams) => {
return useQuery({
queryKey: ['my-properties', params],
queryFn: () => axios.get('/v1/properties/my', { params })
});
};
export const usePropertyMutations = () => {
const queryClient = useQueryClient();
return {
create: useMutation({
mutationFn: (data: CreatePropertyRequest) =>
axios.post('/v1/properties', data),
onSuccess: () => {
queryClient.invalidateQueries(['properties']);
queryClient.invalidateQueries(['my-properties']);
}
}),
update: useMutation({
mutationFn: ({ id, data }: { id: string; data: Partial<CreatePropertyRequest> }) =>
axios.patch(/v1/properties/${id}, data),
onSuccess: () => {
queryClient.invalidateQueries(['properties']);
queryClient.invalidateQueries(['my-properties']);
}
}),
delete: useMutation({
mutationFn: (id: string) => axios.delete(/v1/properties/${id}),
onSuccess: () => {
queryClient.invalidateQueries(['properties']);
queryClient.invalidateQueries(['my-properties']);
}
})
};
};
```

### Zustand Store

```
interface PropertyStore {
filters: {
categoryName?: string;
propertyName?: string;
};
setFilters: (filters: PropertyStore['filters']) => void;
resetFilters: () => void;
}
export const usePropertyStore = create<PropertyStore>((set) => ({
filters: {},
setFilters: (filters) => set({ filters }),
resetFilters: () => set({ filters: {} })
}));
```

## Important Notes

1. Property name max length: 20 characters
2. Tagline max length: 30 characters
3. Country code must be valid ISO 3166-1 alpha-2 (e.g., "US", "UK")
4. Images should be uploaded separately (coverUrl should be a valid URL)
5. Property owner gets additional data (totalIncome, reservations)
6. Amenities are optional but recommended
7. Category must exist in the system

## Error Cases

- 400: Invalid input data
- 401: Not authenticated
- 403: Not property owner
- 404: Property not found
- 400: Category/amenity not found
