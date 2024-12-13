import { Category } from "@/types/category";
import axiosInstance from "./axiosInstance";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useQuery, UseQueryOptions, QueryKey } from "@tanstack/react-query";
import axios from "axios";
import { useEffect } from "react";
import { IconType } from "react-icons";
import { MdCabin, MdWarehouse, MdHolidayVillage, MdOutlineCottage } from "react-icons/md";
import { GiWoodCabin, GiMushroomHouse, GiTreehouse, GiCampingTent, GiCaravan } from "react-icons/gi";
import { PiBarnDuotone, PiTentDuotone } from "react-icons/pi";
import { FaWarehouse, FaHome } from "react-icons/fa";

// Add this array of fallback icons
const fallbackIcons = [GiCaravan, GiWoodCabin, GiMushroomHouse, GiTreehouse, MdHolidayVillage, FaHome] as const;

// Map backend category names to icons
const categoryIcons: Record<string, IconType> = {
  cabin: MdCabin,
  airstream: GiCaravan,
  tent: PiTentDuotone,
  warehouse: MdWarehouse,
  farmhouse: MdHolidayVillage,
  yurt: GiCampingTent,
  safari_tent: PiTentDuotone,
  converted_barn: PiBarnDuotone,
  cottage: MdOutlineCottage,
  container: FaWarehouse,
};

// Add this function to get random icon
const getRandomIcon = () => {
  const randomIndex = Math.floor(Math.random() * fallbackIcons.length);
  return fallbackIcons[randomIndex];
};

interface ApiError {
  statusCode: number;
  message: string | { constraints: Record<string, string> }[];
  error: string;
}

const fetchCategories = async (): Promise<Category[]> => {
  try {
    const response = await axiosInstance.get("/v1/categories");
    return response.data.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.data) {
      const apiError = error.response.data as ApiError;
      throw new Error(typeof apiError.message === "string" ? apiError.message : "Failed to fetch categories");
    }
    throw new Error("Failed to fetch categories");
  }
};

interface CategoriesStore {
  categories: Category[];
  setCategories: (categories: Category[]) => void;
}

export const useCategoriesStore = create<CategoriesStore>()(
  persist(
    (set) => ({
      categories: [],
      setCategories: (categories) => set({ categories }),
    }),
    {
      name: "categories-storage",
    }
  )
);

export const useCategories = () => {
  const { categories, setCategories } = useCategoriesStore();

  const options: UseQueryOptions<Category[], Error, Category[], QueryKey> = {
    queryKey: ["categories"] as const,
    queryFn: fetchCategories,
    staleTime: 1000 * 60 * 5,
    refetchOnMount: false,
    initialData: categories.length > 0 ? categories : undefined,
  };

  const query = useQuery(options);

  useEffect(() => {
    if (query.data && JSON.stringify(query.data) !== JSON.stringify(categories)) {
      setCategories(query.data);
    }
  }, [query.data, categories, setCategories]);

  return {
    ...query,
    // Update getIcon to use random fallback
    getIcon: (categoryName: string) => categoryIcons[categoryName] || getRandomIcon(),
  };
};
