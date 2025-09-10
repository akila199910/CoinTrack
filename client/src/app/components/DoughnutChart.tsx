'use client';

import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import React from 'react';

ChartJS.register(ArcElement, Tooltip, Legend);

type Props = {
    labels: string[];
    values: number[];
    title?: string;
    height?: number | string;
};

function makeColors(n: number) {
    // Simple distinct-ish palette; swap with your own if you like.
    const base = [
        '#4dc9f6', '#f67019', '#f53794', '#537bc4', '#acc236',
        '#166a8f', '#00a950', '#58595b', '#8549ba', '#e8c3b9',
        '#36a2eb', '#ffcd56', '#ff6384', '#9966ff', '#c9cbcf'
    ];
    // Repeat if not enough
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
        plugins: {
            legend: { position: 'bottom', labels: { pointStyle: 'circle', usePointStyle: true } },
            title: {
                display: !!title,
                text: title,
                font: {
                    size: 16,
                    weight: 'bold',
                    family: 'Poppins'
                },
                padding: {
                    top: 10,
                    bottom: 20
                }
            },
            tooltip: { callbacks: { label: ctx => `${ctx.label}: ${ctx.parsed}` } },
        },
    };

    return (
        <div style={{ height }}>
            <Doughnut data={data} options={options} />
        </div>
    );
}
