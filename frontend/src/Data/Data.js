import {
  UilEstate,
  UilClipboardAlt,
  UilFlower,
  UilUsersAlt,
  UilUser,
  UilPackage,
  UilChart,
} from "@iconscout/react-unicons";

export const SidebarData = [
  {
    icon: UilEstate,
    title: "Dashboard",
    path: "/dashboard",
    role: ["Admin", "Cashier"],
  },
  {
    icon: UilClipboardAlt,
    title: "Transactions",
    path: "/transactions",
    role: ["Admin", "Cashier"],
  },
  {
    icon: UilFlower,
    title: "Services",
    path: "/services",
    role: ["Admin"],
  },
  {
    icon: UilClipboardAlt,
    title: "Expenses",
    path: "/expenses",
    role: ["Admin"],
  },
  {
    icon: UilPackage,
    title: "Products",
    path: "/products",
    role: ["Admin", "Cashier"],
  },
  {
    icon: UilUsersAlt,
    title: "Customers",
    path: "/customers",
    role: ["Admin", "Cashier"],
  },
  {
    icon: UilUser,
    title: "Users",
    path: "/users",
    role: ["Admin"],
  },
];
