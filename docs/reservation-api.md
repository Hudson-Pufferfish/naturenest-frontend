# Reservation API

## Authentication

All reservation endpoints require authentication. Include JWT token in headers:

```
headers: {
Authorization: Bearer ${token}
}

```

## Endpoints

### POST /v1/reservations

Create a new reservation for a property.

**Request Body:**

```
type CreateReservationRequest = {
propertyId: string;
startDate: string; // Format: YYYY-MM-DD
endDate: string; // Format: YYYY-MM-DD
numberOfGuests: number;
}
```

**Response:**

```
type ReservationResponse = {
status: 200;
message: 'Success';
data: {
    id: string;
    propertyId: string;
    userId: string;
    totalPrice: number;
    startDate: string;
    endDate: string;
    numberOfGuests: number;
    createdAt: string;
    updatedAt: string;
}
}
```

### GET /v1/reservations

Get user's reservations or property reservations.

**Query Parameters:**

- `propertyId` (optional): Get reservations for specific property
- `skip` (optional): Number of items to skip (default: 0)
- `take` (optional): Number of items to take (default: 10)

**Notes:**

- Results are ordered by creation date (newest first)
- Maximum page size is 50 items
- Requires authentication
- If propertyId is provided, user must be the property owner

**Response:**

```
type ReservationWithDetails = {
id: string;
startDate: string;
endDate: string;
totalPrice: number;
numberOfGuests: number;
property: {
name: string;
price: number;
coverUrl: string;
creator: {
id: string;
username: string;
email: string;
}
};
user: {
id: string;
username: string;
email: string;
}
}
type GetReservationsResponse = {
status: 200;
message: 'Success';
data: ReservationWithDetails[];
}
```

### GET /v1/reservations/my

Get current user's reservations with pagination and status filtering.

**Query Parameters:**

- `status` (optional): Filter reservations by status
  - `upcoming`: Reservations with startDate >= today
  - `past`: Reservations with endDate < today
  - `all`: All reservations (default)
- `skip` (optional): Number of items to skip (default: 0)
- `take` (optional): Number of items to take (default: 10)

**Response:**

```typescript
type GetMyReservationsResponse = {
  status: 200;
  message: "Success";
  data: ReservationWithDetails[]; // Ordered by createdAt desc (most recent first)
};
```

### PATCH /v1/reservations/:reservationId

Update a reservation. Only reservation creator or property owner can update.

**Request Body:**

```
type UpdateReservationRequest = {
startDate?: string; // Format: YYYY-MM-DD
endDate?: string; // Format: YYYY-MM-DD
numberOfGuests?: number;
}

```

### DELETE /v1/reservations/:reservationId

Cancel a reservation. Only reservation creator or property owner can cancel.

## Example Implementation

### React Query Hooks

```typescript
// Get all reservations (for property owner)
export const useReservations = (propertyId?: string) => {
  return useQuery({
    queryKey: ["reservations", propertyId],
    queryFn: () => axios.get("/v1/reservations", { params: { propertyId } }),
  });
};

// Get my reservations (paginated with status filter)
export const useMyReservations = (skip?: number, take?: number, status: "upcoming" | "past" | "all" = "all") => {
  return useQuery({
    queryKey: ["my-reservations", skip, take, status],
    queryFn: () =>
      axios.get("/v1/reservations/my", {
        params: {
          skip,
          take,
          status,
        },
      }),
  });
};

// Create reservation
export const useCreateReservation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateReservationRequest) => axios.post("/v1/reservations", data),
    onSuccess: () => {
      queryClient.invalidateQueries(["reservations"]);
      queryClient.invalidateQueries(["my-reservations"]); // Invalidate my reservations too
    },
  });
};

// Example usage with pagination and status filter:
const MyReservationsPage = () => {
  const [page, setPage] = useState(0);
  const [status, setStatus] = useState<"upcoming" | "past" | "all">("all");
  const pageSize = 10;

  const { data, isLoading } = useMyReservations(page * pageSize, pageSize, status);

  // ... pagination and status filter UI
};
```

### Zustand Store

```
interface ReservationStore {
selectedDates: {
startDate: string | null;
endDate: string | null;
};
guestCount: number;
setDates: (start: string | null, end: string | null) => void;
setGuestCount: (count: number) => void;
reset: () => void;
}
export const useReservationStore = create<ReservationStore>((set) => ({
selectedDates: { startDate: null, endDate: null },
guestCount: 1,
setDates: (startDate, endDate) =>
set({ selectedDates: { startDate, endDate } }),
setGuestCount: (guestCount) => set({ guestCount }),
reset: () => set({
selectedDates: { startDate: null, endDate: null },
guestCount: 1
})
}));
```

### Important Notes

1. Dates must be in YYYY-MM-DD format
2. End date must be after start date
3. Number of guests must be at least 1 and should not exceed the property's capacity (guests)
4. Total price is calculated server-side based on:
   - Number of nights
   - Property price per night
   - Number of guests
5. Rate limiting: 20 requests per minute for create/update operations

### Error Cases

- 400: Invalid dates or guest count
- 401: Not authenticated
- 403: Not authorized (not owner/creator)
- 404: Reservation/Property not found

### Validation Rules

1. Dates:

   - Must be in YYYY-MM-DD format
   - End date must be after start date
   - Start date must be in the future (for new reservations)

2. Number of guests:

   - Must be at least 1
   - Must not exceed property's maximum guest capacity (property.guests)
   - Required for new reservations
   - Optional for updates

3. Pagination:
   - Default page size: 10 items
   - Maximum page size: 50 items
   - Skip must be >= 0
