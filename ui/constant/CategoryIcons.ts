// icons/categoryIcons.ts

import { SvgIconProps } from "@mui/material/SvgIcon";
import MovieIcon from "@mui/icons-material/Movie";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import LocalGroceryStoreIcon from "@mui/icons-material/LocalGroceryStore";
import LocalGasStationIcon from "@mui/icons-material/LocalGasStation";
import HomeWorkIcon from "@mui/icons-material/HomeWork";
import CategoryIcon from "@mui/icons-material/Category";

export const categoryIcons: { [key: string]: React.FC<SvgIconProps> } = {
  entertainment: MovieIcon,
  food: RestaurantIcon,
  "health and fitness": FitnessCenterIcon,
  "bills and utilities": ReceiptLongIcon,
  grocery: LocalGroceryStoreIcon,
  feul: LocalGasStationIcon,
  rent: HomeWorkIcon,
  other: CategoryIcon,
};
