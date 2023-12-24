export interface PropsIcon {
  customClass: string
}

export interface IBlockies {
  address: string;
  customClass: string;
}

export interface IAccountSubMenu {
  name: string,
  icon: JSX.Element
}

export interface IToast {
  open: boolean;
  tx: string
}