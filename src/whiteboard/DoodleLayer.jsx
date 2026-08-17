import React from 'react';

// 涂鸦层：渲染所有已保存笔迹 + 正在绘制的笔迹。
// 坐标用世界坐标，跟随画布 transform 缩放平移。
export default function DoodleLayer({ strokes, current }) {
  return (
    <svg className="wb-doodles">
      {strokes.map((s) => (
        <path
          key={s.id}
          d={pathOf(s.points)}
          stroke={s.color}
          strokeWidth={s.width}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ))}
      {current && (
        <path
          d={pathOf(current.points)}
          stroke={current.color}
          strokeWidth={current.width}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
    </svg>
  );
}

function pathOf(points) {
  if (!points || points.length < 2) return '';
  let d = `M ${points[0]} ${points[1]}`;
  for (let i = 2; i < points.length; i += 2) {
    d += ` L ${points[i]} ${points[i + 1]}`;
  }
  return d;
}
