import { Box } from '@chakra-ui/react';
import React from 'react';
import ReactLoading from 'react-loading';

type LoadingType = "blank" | "balls" | "bars" | "bubbles" | "cubes" | "cylon" | "spin" | "spinningBubbles" | "spokes";

interface PropsLoading {
   type?: LoadingType;
   color?: string;
   height?: string;
   width?: string;
}

export default function Loading({ type, color, height, width }: PropsLoading) {
   return (
      <ReactLoading type={type} color={color} height={height} width={width} />
   )
}
