export type FooterButton = {
  title: string;
  onPress: () => void;
  disabled?: boolean;
};

export type ButtonFooterProps = {
  buttons: FooterButton[];
};
