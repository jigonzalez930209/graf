export const rotate = {
  animation: "spin 1000ms infinite linear",
  "@keyframes spin": {
    "0%": {
      transform: "rotate(0deg)",
    },
    "100%": {
      transform: "rotate(360deg)",
    },
  },
};

export const increaseSize = {
  animation: "increase 1000ms infinite linear",
  "@keyframes increase": {
    "0%": {
      transform: "scale(1)",
    },
    "100%": {
      transform: "scale(1.2)",
    },
  },
};

export const jelloVertical = {
  'animation': 'jello-vertical 1s infinite',
  '@keyframes jello-vertical': {
    '0%': {
      '-webkit-transform': 'scale3d(1, 1, 1)',
      'transform': 'scale3d(1, 1, 1)',
    },
    '30%': {
      '-webkit-transform': 'scale3d(0.75, 1.25, 1)',
      'transform': 'scale3d(0.75, 1.25, 1)',
    },
    '40%': {
      '-webkit-transform': 'scale3d(1.25, 0.75, 1)',
      'transform': 'scale3d(1.25, 0.75, 1)',
    },
    '50%': {
      '-webkit-transform': 'scale3d(0.85, 1.15, 1)',
      'transform': 'scale3d(0.85, 1.15, 1)',
    },
    '65%': {
      '-webkit-transform': 'scale3d(1.05, 0.95, 1)',
      'transform': 'scale3d(1.05, 0.95, 1)',
    },
    '75%': {
      '-webkit-transform': 'scale3d(0.95, 1.05, 1)',
      'transform': 'scale3d(0.95, 1.05, 1)',
    },
    '100%': {
      '-webkit-transform': 'scale3d(1, 1, 1)',
      'transform': 'scale3d(1, 1, 1)',
    },
  },
}
