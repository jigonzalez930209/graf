import * as React from 'react';

const Img = ({ src, alt, style }) => {
  return (
    <img style={{ ...style }} src={src} alt={alt} loading='lazy' />
  );
};


export default Img;