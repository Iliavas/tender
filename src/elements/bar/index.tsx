import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);


interface IBar{
    labels: string[],
    values: number[],
    ratio: number,
    title: string
}

export const MyBar: React.FC<IBar> = (props) => {
    const options = {
        responsive: true,
        aspectRatio: props.ratio,
        //maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top' as const,
            },
            title: {
                display: true,
                text: props.title,
            },
        },
    };
        
        
    const data = {
        labels: props.labels,
        datasets: [
            {
                label: props.title,
                data: props.values,
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
            },
        ],
    };
    return <Bar options={options} data={data} style={{}}/>;
}
