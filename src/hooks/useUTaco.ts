import { useContext } from "react";
import { Context } from "../context/UTacoProvider/UTacoProvider";
const useUTaco = () => {
  const { utaco } = useContext(Context);
  return utaco;
};

export default useUTaco;
