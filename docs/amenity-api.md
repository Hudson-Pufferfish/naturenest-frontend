# Amenity API

## Endpoint

**GET** `/v1/amenities`

Fetch all available farm experience amenities.

### Details

- **Auth:** No authentication required
- **Pagination:** `skip` & `take` parameters supported
- **Default:** Returns first 10 amenities

## Response Types

```
type Amenity = {
id: string;
name: string;
description: string;
createdAt: string;
updatedAt: string;
};

type ApiResponse = {
status: 200;
message: 'Success';
data: Amenity[];
};
```

## Example Implementation

```
// Fetch amenities
const { data, isLoading } = useQuery({
queryKey: ['amenities'],
queryFn: () => axios.get('/v1/amenities')
});

// Store in Zustand
const useAmenityStore = create((set) => ({
amenities: [],
setAmenities: (amenities) => set({ amenities })
}));

```

## Available Amenities

- pig_feeding: Experience feeding and caring for pigs
- crop_harvesting: Participate in harvesting seasonal crops
- dairy_milking: Learn and experience dairy cow milking
- chicken_coop: Collect eggs and feed chickens
- organic_garden: Work in an organic vegetable garden
- tractor_riding: Experience riding farm tractors
- beekeeping: Learn about beekeeping and honey production
- sheep_shearing: Watch or participate in sheep shearing
