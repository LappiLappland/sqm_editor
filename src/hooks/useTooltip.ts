import { useEffect, useRef, useState } from "react";
import { positionType, TooltipWindowState } from "../components/TooltipWindow";


export type assignTooltip = (tooltip: JSX.Element) => {
  element: JSX.Element;
  setState: React.Dispatch<React.SetStateAction<TooltipWindowState>>;
}

type useTooltipState = [
  TooltipWindowState,
  assignTooltip,
]

const DEFAULT_STATE = {
  position: {x: 0, y: 0},
  element: null,
  hidden: true,
};

export default function useTooltip(): useTooltipState {
  const [tooltipState, setTooltipState] = useState<TooltipWindowState>(DEFAULT_STATE);

  function assignTooltip(tooltip: JSX.Element) {
    return {
      element: tooltip,
      setState: setTooltipState
    };
  }

  return [tooltipState, assignTooltip];
}

export type tooltipProp = {
  element: React.ReactNode,
  setState: React.Dispatch<React.SetStateAction<TooltipWindowState>>,
} | null;

type useTooltipComponentType = [
  (e: React.MouseEvent<HTMLElement, MouseEvent>) => void,
  () => void,
]

const TOOLTIP_TIME_TO_SHOW_UP = 3000;

export function useTooltipComponent(tooltip: tooltipProp): useTooltipComponentType {

  const [showTooltip, setShowTooltip] = useState<positionType | null>(null);

  const tooltipTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function displayTooltip(x: number, y: number) {
    if (tooltip) {
      tooltip.setState({
        position: {x, y},
        element: tooltip.element,
        hidden: false,
      });
    }
  }
  function hideTooltip() {
    if (tooltip) {
      if (tooltipTimer.current) {
        clearTimeout(tooltipTimer.current);
      }
      tooltip.setState(DEFAULT_STATE);
    }
  }

  useEffect(() => {
    if (showTooltip) {
      displayTooltip(showTooltip.x, showTooltip.y);
    } else {
      hideTooltip();
    }
  }, [showTooltip]);

  function mouseMovedHandler(e: React.MouseEvent<HTMLElement, MouseEvent>) {
    if (tooltip) {
      if (tooltipTimer.current) {
        clearTimeout(tooltipTimer.current);
        setShowTooltip(null);
      }
      const timer = setTimeout(() => {
        setShowTooltip({x: e.pageX, y: e.pageY});
      }, TOOLTIP_TIME_TO_SHOW_UP);
      tooltipTimer.current = timer;
    }
  }
  function mouseLeaveHandler() {
    hideTooltip();
  }

  return [mouseMovedHandler, mouseLeaveHandler];
}