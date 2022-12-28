import {
  ClipLoader,
  CircleLoader,
  RingLoader,
  BeatLoader,
  ClockLoader,
  SyncLoader,
  ClimbingBoxLoader,
  HashLoader,
  BarLoader,
  BounceLoader,
  DotLoader,
  FadeLoader,
  GridLoader,
  MoonLoader,
  PacmanLoader,
  PropagateLoader,
  PulseLoader,
  PuffLoader,
  RiseLoader,
  RotateLoader,
  ScaleLoader,
  SkewLoader,
  SquareLoader,
} from "react-spinners";

const override: React.CSSProperties = {
  display: "block",
  margin: "0 auto",
  borderColor: "red",
};

type LoaderProps = {
  type: 'clip' | 'circle' | 'ring' | 'beat' | 'clock' | 'sync' | 'climbing' | 'hash' | 'bar' | 'bounce' | 'dot' | 'fade' | 'grid' | 'moon' | 'pacman' | 'propagate' | 'pulse' | 'puff' | 'rise' | 'rotate' | 'scale' | 'skew' | 'square'
  color?: string
  size?: number
}

const Loader: React.FC<LoaderProps> = ({ type, color = '#A0F1EC', size = 150 }) => {
  const loaderType = {
    clip: <ClipLoader color={color} loading={true} cssOverride={override} size={size} aria-label="Loading Spinner" />,
    cicle: <CircleLoader color={color} loading={true} cssOverride={override} size={size} aria-label="Loading Spinner" />,
    ring: <RingLoader color={color} loading={true} cssOverride={override} size={size} aria-label="Loading Spinner" />,
    beat: <BeatLoader color={color} loading={true} cssOverride={override} size={size} aria-label="Loading Spinner" />,
    clock: <ClockLoader color={color} loading={true} cssOverride={override} size={size} aria-label="Loading Spinner" />,
    sync: <SyncLoader color={color} loading={true} cssOverride={override} size={size} aria-label="Loading Spinner" />,
    climbing: <ClimbingBoxLoader color={color} loading={true} cssOverride={override} size={size} aria-label="Loading Spinner" />,
    hash: <HashLoader color={color} loading={true} cssOverride={override} size={size} aria-label="Loading Spinner" />,
    bar: <BarLoader color={color} loading={true} cssOverride={override} aria-label="Loading Spinner" />,
    bounce: <BounceLoader color={color} loading={true} cssOverride={override} size={size} aria-label="Loading Spinner" />,
    dot: <DotLoader color={color} loading={true} cssOverride={override} size={size} aria-label="Loading Spinner" />,
    fade: <FadeLoader color={color} loading={true} cssOverride={override} aria-label="Loading Spinner" />,
    grid: <GridLoader color={color} loading={true} cssOverride={override} size={size} aria-label="Loading Spinner" />,
    moon: <MoonLoader color={color} loading={true} cssOverride={override} size={size} aria-label="Loading Spinner" />,
    pacman: <PacmanLoader color={color} loading={true} cssOverride={override} size={size} aria-label="Loading Spinner" />,
    propagate: <PropagateLoader color={color} loading={true} cssOverride={override} size={size} aria-label="Loading Spinner" />,
    pulse: <PulseLoader color={color} loading={true} cssOverride={override} size={size} aria-label="Loading Spinner" />,
    puff: <PuffLoader color={color} loading={true} cssOverride={override} size={size} aria-label="Loading Spinner" />,
    rise: <RiseLoader color={color} loading={true} cssOverride={override} size={size} aria-label="Loading Spinner" />,
    rotate: <RotateLoader color={color} loading={true} cssOverride={override} size={size} aria-label="Loading Spinner" />,
    scale: <ScaleLoader color={color} loading={true} cssOverride={override} aria-label="Loading Spinner" />,
    skew: <SkewLoader color={color} loading={true} cssOverride={override} size={size} aria-label="Loading Spinner" />,
    square: <SquareLoader color={color} loading={true} cssOverride={override} size={size} aria-label="Loading Spinner" />,

  }

  return loaderType[type];
}

export default Loader