import React from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ScatterController,
} from 'chart.js'
import { Line, Scatter } from 'react-chartjs-2'
import { faker } from '@faker-js/faker'
import zoomPlugin from 'chartjs-plugin-zoom'
import { Chart } from 'chart.js/dist'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  zoomPlugin,
  ScatterController
)

export const options: ChartJS['options'] = {
  responsive: true,
  layout: {
    autoPadding: true,
  },
  scatter: {
    datasets: {
      showLine: true,
    },
  },
  plugins: {
    legend: {
      position: 'left' as const,
      align: 'start' as const,
    },
    title: {
      display: true,
      text: 'Chart.js Line Chart',
    },
    zoom: {
      zoom: {
        wheel: {
          enabled: true,
        },
        mode: 'xy',
      },
      pan: {
        enabled: true,
      },
    },
  },
}

// const labels = Array.from({ length: 100 }).map(() => faker.datatype.number({ min: -1000, max: 1000 }))

export const data: Chart['data'] = {
  labels: Array.from({ length: 100 }).map(() => faker.datatype.number({ min: -1000, max: 1000 })),
  datasets: [
    {
      label: 'Dataset 1',
      type: 'line',
      data: Array.from({ length: 100 }).map(() => ({
        x: faker.datatype.number({ min: -1000, max: 1000 }),
        y: faker.datatype.number({ min: -1000, max: 1000 }),
      })),
      borderColor: 'rgb(255, 99, 132)',
      backgroundColor: 'rgba(255, 99, 132, 0.5)',
    },
    {
      label: 'Dataset 2',
      data: Array.from({ length: 100 }).map(() => ({
        x: faker.datatype.number({ min: -1000, max: 1000 }),
        y: faker.datatype.number({ min: -1000, max: 1000 }),
      })),
      borderColor: 'rgb(53, 162, 235)',
      backgroundColor: 'rgba(53, 162, 235, 0.5)',
    },
  ],
}

const App = () => {
  return <Scatter options={options as ChartJS['options']} data={data} />
}

export default App
