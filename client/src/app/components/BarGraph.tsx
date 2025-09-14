"use client";
import { Bar } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface BarGraphProps {
    labels: string[];
    incomeValues: number[];
    expenseValues: number[];
    savingsValues: number[];
    title?: string;
    height?: number;
};

export default function BarGraph({ labels, incomeValues, expenseValues, savingsValues, title, height = 280 }: BarGraphProps) {

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: true},
            position: 'bottom',
        },
        scales: {
            y: {
                beginAtZero: true,
            },
        },
    };

    return (
    <div style={{ height }} className='mt-4'>
            <Bar
                data={{
                    labels,
                    datasets: [
                        {
                            label: title ?? 'Income',
                            data: incomeValues,
                            backgroundColor: 'rgb(67, 160, 71)',
                            borderWidth: 0,
                        },
                        {
                            label: title ?? 'Expense',
                            data: expenseValues,
                            backgroundColor: 'rgb(229, 57, 53)',
                            borderWidth: 0,
                        },
                        {
                            label: title ?? 'Savings',
                            data: savingsValues,
                            backgroundColor: 'rgb(142, 36, 170)',
                            borderWidth: 0,
                        },
                    ],
                }}
                options={options}
            />
        </div>
    );
}
