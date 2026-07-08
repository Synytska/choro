import { EvilIcons, Feather, FontAwesome5, FontAwesome6, MaterialIcons } from "@expo/vector-icons";

export const Icons = {
  add: {
    library: Feather,
    name: "plus",
  },
  assignment: {
    library: MaterialIcons,
    name: "assignment",
  },
  bin: {
    library: EvilIcons,
    name: "trash",
  },
  calendar: {
    library: EvilIcons,
    name: "calendar",
  },
  check: {
    library: Feather,
    name: "check",
  },
  chevronDown: {
    library: Feather,
    name: "chevron-down",
  },
  chevronLeft: {
    library: Feather,
    name: "chevron-left",
  },
  chevronUp: {
    library: Feather,
    name: "chevron-up",
  },
  close: {
    library: MaterialIcons,
    name: "close",
  },
  coins: {
    library: FontAwesome5,
    name: "coins",
  },
  copy: {
    library: Feather,
    name: "copy",
  },
  done: {
    library: EvilIcons,
    name: "check",
  },
  eye: {
    library: EvilIcons,
    name: "eye",
  },
  eyeClosed: {
    library: Feather,
    name: "eye-off",
  },
  fireFlame: {
    library: FontAwesome6,
    name: "fire-flame-curved",
  },
  gift: {
    library: MaterialIcons,
    name: "card-giftcard",
  },
  groups: {
    library: MaterialIcons,
    name: "groups",
  },
  home: {
    library: MaterialIcons,
    name: "home",
  },
  minus: {
    library: Feather,
    name: "minus",
  },
  pencil: {
    library: EvilIcons,
    name: "pencil",
  },
  pending: {
    library: EvilIcons,
    name: "clock",
  },
  radioOff: {
    library: MaterialIcons,
    name: "radio-button-off",
  },
  radioOn: {
    library: MaterialIcons,
    name: "radio-button-on",
  },
  send: {
    library: Feather,
    name: "send",
  },
  settings: {
    library: EvilIcons,
    name: "gear",
  },
} as const;
