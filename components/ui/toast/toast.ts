import Toast from "react-native-toast-message";

export const showErrorToast = (text: string) => {
  Toast.show({
    type: "error",
    text1: text,
  });
};

export const showSuccessToast = (text: string) => {
  Toast.show({
    type: "success",
    text1: text,
  });
};
