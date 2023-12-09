import { useEffect, useRef, useState } from "react";

export type positionType = {x: number, y: number}

export interface TooltipWindowState {
  position: positionType,
  hidden: boolean,
  element: React.ReactNode | null
}

interface TooltipWindowProps {
  state: TooltipWindowState,
  className?: string,
}

export default function TooltipWindow({state, className = ''}: TooltipWindowProps) {
  
  const [sizes, setSizes] = useState({width: 0, height: 0});
  const refe = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (refe.current) {
      setSizes({width: refe.current.offsetWidth, height: refe.current.offsetHeight});
    }
  }, [state]);

  let xCoord = state.position.x;
  let yCoord = state.position.y;

  if ((window.innerWidth / 2) > xCoord-window.scrollX) xCoord += 5;
  else xCoord -= sizes.width + 5;

  if ((window.innerHeight / 2) > yCoord-window.scrollY) yCoord += 5;
  else yCoord -= sizes.height + 5;

  return (
    <div ref={refe}
      style={{
        left: 0,
        top: 0,
        opacity: state.hidden ? 0 : 1,
        visibility: state.hidden ? 'hidden' : 'visible',
        translate: `${xCoord}px ${yCoord}px`
      }}
      className={className}>
      {state.element}
    </div>
  );
}