import { Property } from "@/types/property";
import { create } from "zustand";

interface PropertyState {
  properties: Property[];
  setProperties: (properties: Property[]) => void;
}

const usePropertyStore = create<PropertyState>((set) => ({
  properties: [],
  setProperties: (properties: Property[]) => set({ properties }),
}));

export default usePropertyStore;
