import { IconType } from "react-icons";
import { MdCabin } from "react-icons/md";

import { TbCaravan, TbTent, TbBuildingCottage } from "react-icons/tb";

import { GiWoodCabin, GiMushroomHouse } from "react-icons/gi";
import { PiWarehouse, PiLighthouse, PiVan, PiBarnDuotone, PiFarmDuotone, PiTentDuotone } from "react-icons/pi";

import { GoContainer } from "react-icons/go";

type Category = {
  label: CategoryLabel;
  icon: IconType;
};

// TODO: Add more categories and check if they are already in the database

export type CategoryLabel =
  | "farmhouse"
  | "cabin"
  | "yurt"
  | "safari_tent"
  | "converted_barn"
  | "airstream"
  | "cottage"
  | "container"
  | "caravan"
  | "tiny"
  | "magic"
  | "warehouse"
  | "lodge";

// TODDO(@hudsonn)
export const categories: Category[] = [
  {
    label: "farmhouse",
    icon: PiFarmDuotone,
  },
  {
    label: "cabin",
    icon: MdCabin,
  },
  {
    label: "yurt",
    icon: TbTent,
  },
  {
    label: "safari_tent",
    icon: PiTentDuotone,
  },
  {
    label: "converted_barn",
    icon: PiBarnDuotone,
  },
  {
    label: "airstream",
    icon: PiVan,
  },
  {
    label: "warehouse",
    icon: PiWarehouse,
  },
  {
    label: "cottage",
    icon: TbBuildingCottage,
  },
  {
    label: "magic",
    icon: GiMushroomHouse,
  },
  {
    label: "container",
    icon: GoContainer,
  },
  {
    label: "caravan",
    icon: TbCaravan,
  },

  {
    label: "tiny",
    icon: PiLighthouse,
  },
  {
    label: "lodge",
    icon: GiWoodCabin,
  },
];
