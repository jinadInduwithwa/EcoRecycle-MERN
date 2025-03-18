
import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import customFetch from "../utils/customFetch";
import { toast } from 'react-toastify';

// Register components in Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function CollectedWasteBarchart() {
    // Initialize array for months
  const [monthlyData, setMonthlyData] = useState(new Array(12).fill(0)); 

  useEffect(() => {
    async function fetchRequestData() {
      try {
        const { data } = await customFetch.get("/waste/retriveCollectedWaste");
        console.log('data fetched :', data);

        const monthCounts = new Array(12).fill(0);

        // fetching the data
        data.forEach(request => {
          const requestDate = new Date(request.CollectedDate);
          const month = requestDate.getMonth();
          monthCounts[month] += 1;
        });
        //update use satate
        setMonthlyData(monthCounts);
      } catch (error) {
        toast.error(error?.response?.data?.msg || 'Failed to fetch data');
        setMonthlyData(new Array(12).fill(0));
      }
    }

    fetchRequestData();
  }, []);

  // chart data
  const data = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    datasets: [
      {
        label: 'Number of Collected Requests',

        data: monthlyData, 

        backgroundColor: 'rgba(89, 245, 39, 0.8)',
        borderColor: 'rgba(89, 245, 39, 0.8)',
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
        text: 'Collected Requests per Month',
        font: {
            size: 20,
          }
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
