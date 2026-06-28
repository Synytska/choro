import { ToastConfig } from "react-native-toast-message";

import AppToast from "../AppToast";

export const toastConfig: ToastConfig = {
  success: (props) => <AppToast {...props} type="success" />,
  error: (props) => <AppToast {...props} type="error" />,
  info: (props) => <AppToast {...props} type="info" />,
};
