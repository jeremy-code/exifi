import { ProgressBar } from "react-aria-components/ProgressBar";
import type { ProgressBarProps } from "react-aria-components/ProgressBar";
import { composeRenderProps } from "react-aria-components/composeRenderProps";

import { composeTailwindRenderProps } from "../utils/composeTailwindRenderProps";

type ProgressCircleProps = {
  size?: number;
} & ProgressBarProps;

// SVG strokes are centered, so subtract half the stroke width from the radius to create an inner stroke.
const STROKE_WIDTH = 4;
const RADIUS = `calc(50% - ${STROKE_WIDTH / 2}px)`;

// https://github.com/adobe/react-spectrum/blob/main/starters/docs/src/ProgressCircle.tsx
const ProgressCircle = ({ size = 16, ...props }: ProgressCircleProps) => {
  return (
    <ProgressBar
      {...props}
      className={composeTailwindRenderProps(
        props.className,
        "size-(--progress-circle-size)",
      )}
      style={composeRenderProps(props.style, (style) => ({
        ...style,
        "--progress-circle-size": `${size}px`,
      }))}
    >
      {({ percentage, isIndeterminate }) => (
        <svg fill="none" width="100%" height="100%" viewBox="0 0 32 32">
          <circle
            className="stroke-accent-fg/25"
            cx="50%"
            cy="50%"
            r={RADIUS}
            strokeWidth={STROKE_WIDTH}
          />
          <circle
            cx="50%"
            cy="50%"
            r={RADIUS}
            className="origin-[center_center] -rotate-90 stroke-accent dark:stroke-accent-fg"
            strokeWidth={STROKE_WIDTH}
            pathLength="100"
            // Add extra gap between dashes so 0% works in Chrome.
            strokeDasharray="100 200"
            strokeDashoffset={
              100 -
              (isIndeterminate || percentage === undefined ? 25 : percentage)
            }
            strokeLinecap="round"
          >
            {isIndeterminate && (
              <animateTransform
                attributeName="transform"
                type="rotate"
                dur="0.75s"
                values="0;360"
                repeatCount="indefinite"
              />
            )}
          </circle>
        </svg>
      )}
    </ProgressBar>
  );
};

export { ProgressCircle, type ProgressCircleProps };
