import {
  AntDesign,
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
  arrowUp: {
    library: Feather,
    name: "arrow-up",
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
    library: Ionicons,
    name: "calendar-outline",
  },
  camera: {
    library: Feather,
    name: "camera",
  },
  chat: {
    library: Ionicons,
    name: "chatbubble-ellipses-outline",
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
  chevronRight: {
    library: Feather,
    name: "chevron-right",
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
  document: {
    library: Ionicons,
    name: "document-text-outline",
  },
  done: {
    library: Feather,
    name: "check-circle",
  },
  eye: {
    library: Feather,
    name: "eye",
  },
  eyeClosed: {
    library: Feather,
    name: "eye-off",
  },
  exclamation: {
    library: FontAwesome6,
    name: "exclamation",
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
    library: MaterialIcons,
    name: "lock-outline",
  },
  logout: {
    library: MaterialIcons,
    name: "logout",
  },
  map: {
    library: Feather,
    name: "map",
  },
  menu: {
    library: Feather,
    name: "menu",
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
    library: Feather,
    name: "edit-2",
  },
  pending: {
    library: Feather,
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
  safety: {
    library: AntDesign,
    name: "safety",
  },
  send: {
    library: Feather,
    name: "send",
  },
  settings: {
    library: EvilIcons,
    name: "gear",
  },
  star: {
    library: FontAwesome,
    name: "star-o",
  },
  user: {
    library: FontAwesome,
    name: "user-circle-o",
  },
  lightning: {
    library: FontAwesome6,
    name: "bolt",
  },
  wallet: {
    library: Ionicons,
    name: "wallet-outline",
  },
} as const;
