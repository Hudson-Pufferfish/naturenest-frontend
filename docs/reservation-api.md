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

```
export const useReservations = (propertyId?: string) => {
return useQuery({
queryKey: ['reservations', propertyId],
queryFn: () => axios.get('/v1/reservations', { params: { propertyId } })
});
};
export const useCreateReservation = () => {
const queryClient = useQueryClient();
return useMutation({
mutationFn: (data: CreateReservationRequest) =>
axios.post('/v1/reservations', data),
onSuccess: () => {
queryClient.invalidateQueries(['reservations']);
}
});
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
3. Number of guests must be at least 1
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
