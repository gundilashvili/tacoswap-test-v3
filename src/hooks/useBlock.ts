import { useContext } from "react";
import { Context } from "../context/UTacoProvider/UTacoProvider";

const useBlock = () => {
  const { block } = useContext(Context);
  return block;
};

export default useBlock;
