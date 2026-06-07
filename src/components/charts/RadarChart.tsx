'use client';

import React from 'react';
import {
  Radar,
  RadarChart as RechartsRadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip
} from 'recharts';

export interface RadarDataPoint {
  subject: string;
  A: number;
  fullMark: number;
}

export interface RadarChartProps {
  data: RadarDataPoint[];
  title?: string;
}

export function RadarChart({ data, title }: RadarChartProps) {
  return (
    <div className="w-full h-[400px] flex flex-col items-center">
      {title && <h3 className="text-lg font-semibold mb-4">{title}</h3>}
      <ResponsiveContainer width="100%" height="100%">
        <RechartsRadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
          <PolarGrid />
          <PolarAngleAxis dataKey="subject" className="text-xs" />
          <PolarRadiusAxis angle={30} domain={[0, 100]} />
          <Radar
            name="Pencapaian CPL"
            dataKey="A"
            stroke="#2563eb"
            fill="#3b82f6"
            fillOpacity={0.6}
          />
          <Tooltip />
        </RechartsRadarChart>
      </ResponsiveContainer>
    </div>
  );
}

