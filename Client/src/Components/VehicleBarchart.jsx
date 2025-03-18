import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import customFetch from "../utils/customFetch";
import { toast } from 'react-toastify';

// Register components in Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function VehicleBarchart() {
  const [monthlyData, setMonthlyData] = useState(new Array(12).fill(0)); 

  useEffect(() => {
    async function fetchRequestData() {
      try {
        const { data } = await customFetch.get("/vehicle/retrivevehicles");
        console.log('data fetched :', data);

        // Initialize an array to store counts of requests for each month
        const monthCounts = new Array(12).fill(0);

        // fetch the data
        data.forEach(request => {
          const requestDate = new Date(request.AddDate);
          const month = requestDate.getMonth();
          monthCounts[month] += 1;
        });

        setMonthlyData(monthCounts);
      } catch (error) {
        toast.error(error?.response?.data?.msg || 'Failed to fetch data');
        setMonthlyData(new Array(12).fill(0)); 
      }
    }

    fetchRequestData();
  }, []);

  // data for the chart
  const data = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    datasets: [
      {
        label: 'Number of Collected Requests',

        data: monthlyData, 

        backgroundColor: 'rgba(39, 196, 245, 0.8)',
        borderColor: 'rgba(39, 196, 245, 0.8)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Vehicle Engagement per Month',
        font: {
            size: 20, 
          },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div style={{ width: '80%', margin: '0 auto' }}>
      <Bar data={data} options={options} />
    </div>
  );
}

