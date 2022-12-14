
import * as React from 'react';
import _ from 'lodash';
import ReactApexChart from 'react-apexcharts'
import { ApexOptions } from 'apexcharts';
import { useData } from '../../hooks/useData';
import { COLORS } from '../../utils/utils';
import { IGrafType } from '../../interfaces/interfaces';
import { GrafContext } from '../../context/GraftContext';

// const options = {

//   series: [{
//     name: 'Income',
//     type: 'column',
//     data: [1.4, 2, 2.5, 1.5, 2.5, 2.8, 3.8, 4.6]
//   }, {
//     name: 'Cashflow',
//     type: 'column',
//     data: [1.1, 3, 3.1, 4, 4.1, 4.9, 6.5, 8.5]
//   }, {
//     name: 'Revenue',
//     type: 'line',
//     data: [20, 29, 37, 36, 44, 45, 50, 58]
//   }],
//   options: {
//     chart: {
//       height: 350,
//       type: 'line',
//       stacked: false
//     },
//     dataLabels: {
//       enabled: false
//     },
//     stroke: {
//       width: [1, 1, 4]
//     },
//     title: {
//       text: 'XYZ - Stock Analysis (2009 - 2016)',
//       align: 'left',
//       offsetX: 110
//     },
//     xaxis: {
//       categories: [2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016],
//     },
//     yaxis: [
//       {
//         axisTicks: {
//           show: true,
//         },
//         axisBorder: {
//           show: true,
//           color: '#008FFB'
//         },
//         labels: {
//           style: {
//             colors: '#008FFB',
//           }
//         },
//         title: {
//           text: "Income (thousand crores)",
//           style: {
//             color: '#008FFB',
//           }
//         },
//         tooltip: {
//           enabled: true
//         }
//       },
//       {
//         seriesName: 'Income',
//         opposite: true,
//         axisTicks: {
//           show: true,
//         },
//         axisBorder: {
//           show: true,
//           color: '#00E396'
//         },
//         labels: {
//           style: {
//             colors: '#00E396',
//           }
//         },
//         title: {
//           text: "Operating Cashflow (thousand crores)",
//           style: {
//             color: '#00E396',
//           }
//         },
//       },
//       {
//         seriesName: 'Revenue',
//         opposite: true,
//         axisTicks: {
//           show: true,
//         },
//         axisBorder: {
//           show: true,
//           color: '#FEB019'
//         },
//         labels: {
//           style: {
//             colors: '#FEB019',
//           },
//         },
//         title: {
//           text: "Revenue (thousand crores)",
//           style: {
//             color: '#FEB019',
//           }
//         }
//       },
//     ],
//     tooltip: {
//       fixed: {
//         enabled: true,
//         position: 'topLeft', // topRight, topLeft, bottomRight, bottomLeft
//         offsetY: 30,
//         offsetX: 60
//       },
//     },
//     legend: {
//       horizontalAlign: 'left',
//       offsetX: 40
//     }
//   },


// };


type ApexChartProps = {
  type: IGrafType
  isImpedance: boolean
  isVC: boolean
}

const ApexChart: React.FC<ApexChartProps> = ({ type = 'scatter', isImpedance = true, isVC = false }) => {

  const { getImpedanceData, getModuleFase, getVCData } = useData()

  const { graftState: { fileType } } = React.useContext(GrafContext)
  // console.log(getImpedanceData())


  // change to a function that returns the data content
  const series = () => {

    if (fileType === 'teq4') {
      return getVCData({ eliminateInnerPoints: 4 })?.map((d) => ({ name: d.name, data: d.content }))
    }
    return isImpedance ? getImpedanceData()?.map((d) => ({ name: d.name, data: d.content })) : [...getModuleFase()?.data.map((d) => ({ name: d.name + ' fase', data: d.content.map(i => ([i.fase.x, i.fase.y])) })), ...getModuleFase()?.data.map((d) => ({ name: d.name + ' module', data: d.content.map(i => ([i.module.x, i.module.y])) }))]

  }

  const options: ApexOptions = {
    chart: {
      height: 500,
      type: 'line',

      zoom: {
        enabled: true,
        type: 'x'
      },

    },
    xaxis: {
      tickAmount: 0.01,
      labels: {
        formatter: function (val) {
          return parseFloat(val).toFixed(10)
        }
      }
    },
    yaxis: {
      tickAmount: 8,
      labels: {
        formatter: (val: number) => val.toFixed(10).toString()
      }
    },
    colors: COLORS,
    markers: {
      size: 1
    },
  }


  if (isVC) {
    return (
      // @ts-ignore
      <ReactApexChart
        options={options}
        // series={series()}
        type="line"
        height={350}
      />
    )
  }

  return (series?.length > 0 &&
    // @ts-ignore
    <ReactApexChart
      // {...options}
      options={options}
      // series={series()}
      type={type}
      height={500}
    />
  );
}
export default ApexChart;
