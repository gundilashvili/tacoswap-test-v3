import jar from "../../assets/images/comb.png";
// import jar from '../../assets/img/comb.png'

const UTacoIcon = ({ size = 36, v1 }: any) => (
  <span
    role="img"
    style={{
      fontSize: size,
      filter: v1 ? "saturate(0.5)" : undefined,
    }}
  >
    <img src={jar} height="25" alt="Combine.finance" />
  </span>
);

export default UTacoIcon;
