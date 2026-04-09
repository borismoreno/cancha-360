import { memo } from "react";

interface RadarChartProps {
  technical: number;
  tactical: number;
  physical: number;
  attitude: number;
}

const CX = 130;
const CY = 105;
const R = 75;
// const AXES = 5;

function polarToCart(angleDeg: number, radius: number) {
  const rad = (angleDeg * Math.PI) / 180;
  return { x: CX + radius * Math.cos(rad), y: CY + radius * Math.sin(rad) };
}

// Pentagon: top at -90°, then clockwise every 72°
const ANGLES_DEG = [-90, -18, 54, 126, 198];
const LABELS = ["TÉCNICA", "TÁCTICA", "FÍSICO", "ACTITUD", "VISIÓN"];
const LABEL_R = R + 20;
const GRID_LEVELS = [0.33, 0.66, 1.0];

function gridPath(level: number) {
  const pts = ANGLES_DEG.map((a) => polarToCart(a, R * level));
  return (
    pts
      .map(
        (p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`,
      )
      .join(" ") + "Z"
  );
}

function dataPath(values: number[]) {
  const pts = ANGLES_DEG.map((a, i) =>
    polarToCart(a, (Math.min(values[i], 10) / 10) * R),
  );
  return (
    pts
      .map(
        (p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`,
      )
      .join(" ") + "Z"
  );
}

export default memo(function RadarChart({
  technical,
  tactical,
  physical,
  attitude,
}: RadarChartProps) {
  const vision = (technical + tactical) / 2;
  const values = [technical, tactical, physical, attitude, vision];

  return (
    <svg viewBox="0 0 260 210" className="w-full max-w-xs mx-auto">
      {/* Grid rings */}
      {GRID_LEVELS.map((level) => (
        <path
          key={level}
          d={gridPath(level)}
          fill="none"
          stroke="#262626"
          strokeWidth={level === 1 ? "1.5" : "1"}
        />
      ))}

      {/* Axis lines */}
      {ANGLES_DEG.map((angle, i) => {
        const end = polarToCart(angle, R);
        return (
          <line
            key={i}
            x1={CX}
            y1={CY}
            x2={end.x.toFixed(1)}
            y2={end.y.toFixed(1)}
            stroke="#262626"
            strokeWidth="1"
          />
        );
      })}

      {/* Data polygon */}
      <path
        d={dataPath(values)}
        fill="#bcf521"
        fillOpacity="0.18"
        stroke="#bcf521"
        strokeWidth="2"
        strokeLinejoin="round"
      />

      {/* Data points */}
      {ANGLES_DEG.map((angle, i) => {
        const p = polarToCart(angle, (Math.min(values[i], 10) / 10) * R);
        return (
          <circle
            key={i}
            cx={p.x.toFixed(1)}
            cy={p.y.toFixed(1)}
            r="3.5"
            fill="#bcf521"
          />
        );
      })}

      {/* Labels */}
      {ANGLES_DEG.map((angle, i) => {
        const p = polarToCart(angle, LABEL_R);
        return (
          <text
            key={i}
            x={p.x.toFixed(1)}
            y={p.y.toFixed(1)}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="#adaaaa"
            fontSize="8.5"
            fontFamily="Inter, sans-serif"
            fontWeight="500"
            letterSpacing="0.05em"
          >
            {LABELS[i]}
          </text>
        );
      })}
    </svg>
  );
});
