'use client';

import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  type Plugin
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

const OutsideLabelArrows: Plugin<'doughnut'> = {
  id: 'outsideLabelArrows',
  afterDatasetsDraw(chart, _args, opts?: any) {
    const ctx = chart.ctx;
    const meta = chart.getDatasetMeta(0);
    const ds = chart.data.datasets[0] as any;
    if (!meta || !ds) return;

    ctx.save();
    const lineColor = opts?.lineColor ?? 'rgba(0,0,0,0.45)';
    const lineWidth = opts?.lineWidth ?? 1;
    const arrowSize = opts?.arrowSize ?? 0;
    const elbow = opts?.elbow ?? 16;
    const extra = opts?.extra ?? 14;

    ctx.strokeStyle = lineColor;
    ctx.fillStyle = lineColor;
    ctx.lineWidth = lineWidth;

    meta.data.forEach((arc: any, i: number) => {
      const value = (ds.data?.[i] as number) ?? 0;
      if (!value) return;

      const cx = arc.x;
      const cy = arc.y;
      const r = arc.outerRadius;
      const mid = (arc.startAngle + arc.endAngle) / 2;

      // point on arc edge
      const fromX = cx + Math.cos(mid) * r;
      const fromY = cy + Math.sin(mid) * r;

      // bend point a bit outside
      const bendX = cx + Math.cos(mid) * (r + extra);
      const bendY = cy + Math.sin(mid) * (r + extra);

      const isRight = Math.cos(mid) >= 0;
      const endX = bendX + (isRight ? elbow : -elbow);
      const endY = bendY;

      // line + elbow
      ctx.beginPath();
      ctx.moveTo(fromX, fromY);
      ctx.lineTo(bendX, bendY);
      ctx.lineTo(endX, endY);
      ctx.stroke();

      // arrow head pointing to the slice
      const theta = mid + Math.PI; // direction back toward the slice
      ctx.beginPath();
      ctx.moveTo(fromX, fromY);
      ctx.lineTo(
        fromX + Math.cos(theta - 0.4) * arrowSize,
        fromY + Math.sin(theta - 0.4) * arrowSize
      );
      ctx.lineTo(
        fromX + Math.cos(theta + 0.4) * arrowSize,
        fromY + Math.sin(theta + 0.4) * arrowSize
      );
      ctx.closePath();
      ctx.fill();
    });

    ctx.restore();
  }
};

ChartJS.register(OutsideLabelArrows);

type Props = {
  labels: string[];
  values: number[];
  title?: string;
  height?: number | string;
};

function makeColors(n: number) {
  const base = [
    '#4dc9f6','#f67019','#f53794','#537bc4','#acc236',
    '#166a8f','#00a950','#58595b','#8549ba','#e8c3b9',
    '#36a2eb','#ffcd56','#ff6384','#9966ff','#c9cbcf'
  ];
  return Array.from({ length: n }, (_, i) => base[i % base.length]);
}

export default function DoughnutChart({ labels, values, title, height = 280 }: Props) {
  const data = {
    labels,
    datasets: [
      {
        label: title ?? 'Amount',
        data: values,
        backgroundColor: makeColors(values.length),
        borderWidth: 0,
      },
    ],
  };

  const options: React.ComponentProps<typeof Doughnut>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '50%',
    layout: { padding: 35 }, // give room outside for labels
    plugins: {
      legend: { display: false },
      title: {
        display: !!title,
        text: title,
        font: { size: 16, weight: 'bold', family: 'Poppins' },
        padding: { top: 10, bottom: 20 },
      },
      tooltip: { callbacks: { label: (ctx) => `${ctx.label}: ${ctx.parsed}` } },

      // always-visible labels OUTSIDE
      datalabels: {
        display: true,
        formatter: (value, ctx) => {
          const label = ctx.chart.data.labels?.[ctx.dataIndex] ?? '';
          return `${label}: ${value}`;
        },
        anchor: 'end',     // stick to outer edge of arc
        align: 'end',      // radiate outward
        offset: 16,        // push outside the arc
        clamp: false,
        clip: false,       // allow outside chart area
        color: '#111',
        backgroundColor: 'white',
        borderColor: 'rgba(0,0,0,0.15)',
        borderWidth: 1,
        borderRadius: 4,
        padding: { top: 0, bottom: 2, left: 6, right: 6 },
        font: { weight: 600, size: 12, family: 'Poppins' },
      },
    },
  };

  return (
    <div style={{ height }} className='mt-4'>
      <Doughnut data={data} options={options} />
    </div>
  );
}
