// icons.ts

import { Feather, FontAwesome5, FontAwesome6, MaterialIcons } from "@expo/vector-icons";

export const Icons = {
  //Feather
  add: {
    library: Feather,
    name: "plus",
  },
  settings: {
    library: Feather,
    name: "settings",
  },
  eye: {
    library: Feather,
    name: "eye",
  },
  eye_closed: {
    library: Feather,
    name: "eye-off",
  },
  send: {
    library: Feather,
    name: "send",
  },
  check: {
    library: Feather,
    name: "check",
  },
  copy: {
    library: Feather,
    name: "copy",
  },
  chevronLeft: {
    library: Feather,
    name: "chevron-left",
  },

  //FontAwesome5
  coins: {
    library: FontAwesome5,
    name: "coins",
  },

  //FontAwesome6
  fireFlame: {
    library: FontAwesome6,
    name: "fire-flame-curved",
  },
  pencil: {
    library: FontAwesome6,
    name: "pencil",
  },

  //MaterialIcons
  groups: {
    library: MaterialIcons,
    name: "groups",
  },
  assignment: {
    library: MaterialIcons,
    name: "assignment",
  },
  home: {
    library: MaterialIcons,
    name: "home",
  },
  gift: {
    library: MaterialIcons,
    name: "card-giftcard",
  },
  calendar: {
    library: MaterialIcons,
    name: "calendar-month",
  },
  done: {
    library: MaterialIcons,
    name: "task-alt",
  },
  pending: {
    library: MaterialIcons,
    name: "schedule",
  },
  radioOff: {
    library: MaterialIcons,
    name: "radio-button-off",
  },
  radioOn: {
    library: MaterialIcons,
    name: "radio-button-on",
  },
} as const;
