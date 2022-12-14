import { ClipLoader, CircleLoader, RingLoader } from "react-spinners";

const override: React.CSSProperties = {
  display: "block",
  margin: "0 auto",
  borderColor: "red",
};

type LoaderProps = {
  type: 'clip' | 'circle' | 'ring'
  color?: string
  size?: number
}

const Loader: React.FC<LoaderProps> = ({ type, color = 'blue', size = 150 }) => {
  const loaderType = {
    clip: <ClipLoader color={color} loading={true} cssOverride={override} size={size} aria-label="Loading Spinner" />,
    cicle: <CircleLoader color={color} loading={true} cssOverride={override} size={size} aria-label="Loading Spinner" />,
    ring: <RingLoader color={color} loading={true} cssOverride={override} size={size} aria-label="Loading Spinner" />,
  }

  return loaderType[type];
}

export default Loader