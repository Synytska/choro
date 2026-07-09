import {
  EvilIcons,
  Feather,
  FontAwesome,
  FontAwesome5,
  FontAwesome6,
  Ionicons,
  MaterialIcons,
} from "@expo/vector-icons";

export const Icons = {
  add: {
    library: Feather,
    name: "plus",
  },
  assignment: {
    library: FontAwesome6,
    name: "list-check",
  },
  bin: {
    library: FontAwesome,
    name: "trash-o",
  },
  calendar: {
    library: EvilIcons,
    name: "calendar",
  },
  camera: {
    library: Feather,
    name: "camera",
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
    library: FontAwesome5,
    name: "gift",
  },
  groups: {
    library: FontAwesome,
    name: "group",
  },
  home: {
    library: FontAwesome5,
    name: "home",
  },
  language: {
    library: Ionicons,
    name: "language",
  },
  lock: {
    library: Feather,
    name: "lock",
  },
  logout: {
    library: MaterialIcons,
    name: "logout",
  },
  minus: {
    library: Feather,
    name: "minus",
  },
  notification: {
    library: MaterialIcons,
    name: "notifications-none",
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
  user: {
    library: FontAwesome,
    name: "user-circle-o",
  },
} as const;
