import type { IBlockies } from '@/types';
import makeBlockie from 'ethereum-blockies-base64';

export const Blockies = ({ address, customClass }: IBlockies) => {
  return (
    <img src={makeBlockie(address)} className={customClass} />
  )
}