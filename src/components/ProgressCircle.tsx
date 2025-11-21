import React from 'react';

interface ProgressCircleProps {
  percentage: number;
  size: number;
}

const ProgressCircle: React.FC<ProgressCircleProps> = ({
  percentage,
  size,
}) => {
  const strokeWidth = size * 0.08;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  const hue = percentage * 1.2;
  const color = `hsl(${hue}, 70%, 50%)`;

  return (
    <svg width={size} height={size} className="progress-circle">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="#2a2a2a"
        strokeWidth={strokeWidth}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        className="progress-circle__stroke"
      />
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dy=".3em"
        className="progress-circle__text"
        fill={color}
      >
        {percentage.toFixed(0)}%
      </text>
    </svg>
  );
};

export default ProgressCircle;
