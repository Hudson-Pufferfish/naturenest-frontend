# Category API

## GET /v1/categories

Fetch all available property categories.

- **Auth:** No authentication required
- **Pagination:** `skip` & `take` parameters supported
- **Default:** Returns first 10 categories

### Response Type

```
type Category = {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
};


type ApiResponse = {
status: 200;
message: 'Success';
data: Category[];
};
```

### Example Implementat

```
// Fetch categories
const { data, isLoading } = useQuery({
queryKey: ['categories'],
queryFn: () => axios.get('/v1/categories')
});
// Store in Zustand
const useCategoryStore = create((set) => ({
categories: [],
selectedCategory: null,
setCategories: (categories) => set({ categories }),
setSelectedCategory: (id) => set({ selectedCategory: id })
}));

```

### Available Categories

- farmhouse: Traditional farm accommodations offering an authentic rural experience
- cabin: Cozy wooden cabins in natural settings
- airstream: Classic Airstream trailers for unique camping
- tent: Traditional camping tents for outdoor adventure
- warehouse: Converted industrial spaces
- cottage: Charming small houses with countryside appeal
- container: Modern converted shipping containers
- caravan: Mobile homes for flexible traveling
- lodge: Spacious mountain or forest lodges
- yurt: Traditional circular tents for glamping
- safari_tent: Luxury canvas tents for glamping
- converted_barn: Renovated barns with modern comfort
