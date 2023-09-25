import _ from 'lodash'
import * as React from 'react'
import { useWindowSize } from 'usehooks-ts'

import { GrafContext } from '../context/GraftContext'
import { COLORS } from '../utils/utils'

import { useData } from './useData'

const StaticValues = ({ drawerOpen = true, width = 720, height = 540 }) => ({
  autosize: true,
  width: drawerOpen ? width * 0.72 : width * 0.876,
  height: drawerOpen ? height * 0.8 : height * 0.8,
  legend: {
    x: 1.1,
    traceorder: 'normal',
    font: {
      family: 'sans-serif',
      size: 12,
      color: '#000',
    },
  },
  margin: {
    l: 50,
    r: 50,
    b: 100,
    t: 50,
    pad: 4,
  },
  title: {
    font: {
      size: 18,
    },
    xref: 'paper',
    x: 0.005,
  },
  transition: {
    duration: 500,
    easing: 'cubic-in-out',
  },
  frame: {
    duration: 500,
  },
})

const hovertemplate = (name: string) => `
  <b>${name}</b><br>
  <br>
  %{yaxis.title.text}: %{y}<br>
  %{xaxis.title.text}: %{x}<br>
  <extra></extra>
`

const usePlotlyOptions = () => {
  const {
    graftState: {
      fileType,
      graftType,
      impedanceType,
      stepBetweenPoints,
      drawerOpen,
      csvFileColum,
      lineOrPointWidth,
    },
  } = React.useContext(GrafContext)
  const { height, width } = useWindowSize()

  const {
    getImpedanceData,
    getModuleFase,
    getVCData,
    getZIZRvsFrequency,
    getCSVData,
    data: currentData,
  } = useData()

  const [layout, setLayout] = React.useState(null)
  const [config, setConfig] = React.useState({ scrollZoom: true })
  const [data, setData] = React.useState([])

  React.useEffect(() => {
    if (currentData?.length > 0) {
      if (fileType === 'teq4Z') {
        if (impedanceType === 'Bode') {
          setData(
            _.flatMapDepth(
              getModuleFase().map((d, i) => [
                {
                  x: d.content.map(i => i.fase.x),
                  y: d.content.map(i => i.fase.y),
                  type: 'scatter',
                  hovertemplate: hovertemplate(`fase_${d.name}`),
                  mode: graftType === 'line' ? 'lines+markers' : 'markers',
                  name: `fase_${d.name}`,
                  marker: {
                    color: d.color,
                    size: graftType === 'line' ? lineOrPointWidth + 3 : lineOrPointWidth,
                  },
                  line: { color: d.color, width: lineOrPointWidth },
                  yaxis: 'y2',
                  legendgroup: `${d.name}`,
                },
                {
                  x: d.content.map(i => i.module.x),
                  y: d.content.map(i => i.module.y),
                  type: 'scatter',
                  hovertemplate: hovertemplate(`module_${d.name}`),
                  mode: graftType === 'line' ? 'lines+markers' : 'markers',
                  name: `module_${d.name}`,
                  marker: {
                    color: d.color,
                    size: graftType === 'line' ? lineOrPointWidth + 3 : lineOrPointWidth,
                  },

                  line: { color: d.color, width: lineOrPointWidth },
                  legendgroup: `${d.name}`,
                },
              ])
            )
          )

          setLayout({
            autosize: false,
            width: drawerOpen ? width * 0.8 : width * 0.94,
            height: drawerOpen ? height * 0.89 : height * 0.89,
            hovermode: 'closest',
            legend: {
              x: 1.1,
              traceorder: 'normal',
              font: {
                family: 'sans-serif',
                size: 12,
                color: '#000',
              },
            },
            margin: {
              l: drawerOpen ? 50 : 0,
              r: 50,
              b: 100,
              t: 50,
              pad: 4,
            },
            title: {
              text: impedanceType,
              font: {
                size: 18,
              },
              xref: 'paper',
              x: 0.005,
            },
            xaxis: {
              title: {
                text: 'log10(Frequency(Hz))',
                font: {
                  size: 18,
                  color: '#7f7f7f',
                },
              },
            },
            yaxis: {
              title: {
                text: 'Fase',
                x: 0,
                font: {
                  size: 18,
                  color: '#7f7f7f',
                },
              },
            },
            yaxis2: {
              title: 'Module',
              overlaying: 'y',
              side: 'right',
              titlefont: { color: '#7f7f7f', size: 18 },
              tickfont: { color: '#7f7f7f' },
            },
          })
        } else if (impedanceType === 'Nyquist') {
          setData(
            getImpedanceData().map(d => ({
              x: d.content.map(i => i[0]),
              y: d.content.map(i => i[1]),
              hovertemplate: hovertemplate(d.name),
              type: 'scatter',
              mode: graftType === 'line' ? 'lines+markers' : 'markers',
              name: d.name,
              marker: {
                color: d.color,
                size: graftType === 'line' ? lineOrPointWidth + 3 : lineOrPointWidth,
              },
              line: { color: d.color, width: lineOrPointWidth },
            }))
          )
          setLayout({
            autosize: false,
            hovermode: 'closest',
            width: drawerOpen ? width * 0.8 : width * 0.95,
            height: drawerOpen ? height * 0.89 : height * 0.89,
            margin: {
              l: 50,
              r: 50,
              b: 100,
              t: 50,
              pad: 4,
            },
            title: {
              text: impedanceType,
              font: {
                // family: 'Courier New, monospace',
                size: 18,
              },
              xref: 'paper',
              x: 0.05,
            },
            xaxis: {
              title: {
                text: 'ZR',
                font: {
                  // family: 'Courier New, monospace',
                  size: 18,
                  color: '#7f7f7f',
                },
              },
            },
            yaxis: {
              title: {
                text: 'ZI',
                font: {
                  // family: 'Courier New, monospace',
                  size: 18,
                  color: '#7f7f7f',
                },
              },
            },
          })
        } else if (impedanceType === 'ZiZrVsFreq') {
          setData(
            _.flatMapDepth(
              getZIZRvsFrequency().map(d => [
                {
                  x: d.content.map(j => j.Zi.x),
                  y: d.content.map(j => j.Zi.y),
                  type: 'scatter',
                  hovertemplate: hovertemplate(`ZI_${d.name}`),
                  mode: graftType === 'line' ? 'lines+markers' : 'markers',
                  name: `ZI_${d.name}`,
                  marker: {
                    color: d.color,
                    size: graftType === 'line' ? lineOrPointWidth + 3 : lineOrPointWidth,
                  },
                  line: { color: d.color, width: lineOrPointWidth },
                  yaxis: 'y2',
                  legendgroup: `${d.name}`,
                },
                {
                  x: d.content.map(j => j.Zr.x),
                  y: d.content.map(j => j.Zr.y),
                  type: 'scatter',
                  hovertemplate: hovertemplate(`ZR_${d.name}`),
                  mode: graftType === 'line' ? 'lines+markers' : 'markers',
                  name: `ZR_${d.name}`,
                  marker: { color: d.color, size: lineOrPointWidth },
                  line: { color: d.color, width: lineOrPointWidth },
                  legendgroup: `${d.name}`,
                },
              ])
            )
          )

          setLayout({
            autosize: false,
            width: drawerOpen ? width * 0.8 : width * 0.95,
            height: drawerOpen ? height * 0.89 : height * 0.89,
            hovermode: 'closest',
            legend: {
              x: 1.1,
              traceorder: 'normal',
              font: {
                family: 'sans-serif',
                size: 12,
                color: '#000',
              },
            },
            margin: {
              l: 50,
              r: 50,
              b: 100,
              t: 50,
              pad: 4,
            },
            title: {
              text: impedanceType,
              font: {
                size: 18,
              },
              xref: 'paper',
              x: 0.005,
            },
            xaxis: {
              title: {
                text: 'log10(Frequency(Hz))',
                font: {
                  size: 18,
                  color: '#7f7f7f',
                },
              },
            },
            yaxis: {
              title: {
                text: 'ZR',
                x: 0,
                font: {
                  size: 18,
                  color: '#7f7f7f',
                },
              },
            },
            yaxis2: {
              title: 'ZI',
              overlaying: 'y',
              side: 'right',
              titlefont: { color: '#7f7f7f', size: 18 },
              tickfont: { color: '#7f7f7f' },
            },
          })
        }
      } else if (fileType === 'teq4') {
        setData(
          getVCData(stepBetweenPoints).map(d => ({
            x: d.content.map(j => j[0]),
            y: d.content.map(j => j[1]),
            type: 'scatter',
            hovertemplate: hovertemplate(d.name),
            mode: graftType === 'line' ? 'lines' : 'markers',
            name: d.name,
            marker: { color: d.color, size: graftType === 'line' ? 0 : lineOrPointWidth },
            line: { color: d.color, width: lineOrPointWidth },
            color: d.color,
          }))
        )

        setLayout({
          autosize: false,
          width: drawerOpen ? width * 0.8 : width * 0.95,
          height: drawerOpen ? height * 0.89 : height * 0.89,
          hovermode: 'closest',
          margin: {
            l: 50,
            r: 50,
            b: 100,
            t: 50,
            pad: 4,
          },
          title: {
            text: 'VC',
            font: {
              size: 18,
            },
            xref: 'paper',
            x: 0.05,
          },
          xaxis: {
            title: {
              text: 'Voltage (mV)',
              font: {
                size: 18,
                color: '#7f7f7f',
              },
            },
          },
          yaxis: {
            title: {
              text: 'Current (mA)',
              font: {
                size: 18,
                color: '#7f7f7f',
              },
            },
          },
        })
      } else if (fileType === 'csv') {
        let csvData = getCSVData(
          csvFileColum?.find(csv => csv.selected && !!currentData.find(d => d.name === csv.fileName)?.name)
        )

        if (csvData?.x?.length === 1) {
          setData(
            _.flatMapDepth(
              csvData?.y.map((d, i) => {
                let values = []
                values.push({
                  x: csvData.x[0].content,
                  y: d.content,
                  type: 'scatter',
                  hovertemplate: hovertemplate(csvData.y[i].name),
                  mode: graftType === 'line' ? 'lines' : 'markers',
                  name: d.name,
                  legendgroup: `${d.name}`,
                  marker: {
                    color: COLORS[i],
                    size: 3,
                  },
                  line: {
                    color: COLORS[i],
                    width: 1,
                  },
                  color: COLORS[i],
                })
                csvData?.y2[i]?.name &&
                  values.push({
                    x: csvData.x[0].content,
                    y: csvData.y2[i].content,
                    type: 'scatter',
                    hovertemplate: hovertemplate(`y2_${csvData.y2[i].name}`),
                    mode: graftType === 'line' ? 'lines' : 'markers',
                    name: `y2_${csvData?.y2[i]?.name}`,
                    legendgroup: `${csvData.x[0].name}`,
                    yaxis: 'y2',
                    marker: {
                      color: COLORS[i],
                      size: 3,
                    },
                    line: {
                      color: COLORS[i],
                      width: 1,
                    },
                    color: COLORS[i],
                  })

                return values
              })
            )
          )

          setLayout({
            ...StaticValues({ drawerOpen: drawerOpen, width: width, height: height }),
            xaxis: {
              title: {
                text: csvData.x[0].name,
                font: {
                  size: 18,
                  color: '#7f7f7f',
                },
              },
            },
            yaxis: {
              title: {
                text: csvData.y[0].name,
                x: 0,
                font: {
                  size: 18,
                  color: '#7f7f7f',
                },
              },
            },
            yaxis2: {
              title: csvData.y2[0]?.name,
              overlaying: 'y',
              side: 'right',
              titlefont: { color: '#7f7f7f', size: 18 },
              tickfont: { color: '#7f7f7f' },
            },
          })

          return
        } else if (csvData?.x?.length > 1) {
          setData(
            _.flatMapDepth(
              csvData.x.map((d, i) => {
                let values = []
                values.push({
                  x: d.content,
                  y: csvData.y[i].content,
                  type: 'scatter',
                  hovertemplate: hovertemplate('CSV'),

                  mode: graftType === 'line' ? 'lines' : 'markers',
                  name: csvData.y[i].name,
                  legendgroup: `${d.name}`,
                  marker: {
                    color: COLORS[i],
                    size: lineOrPointWidth,
                  },
                  line: {
                    color: COLORS[i],
                    width: lineOrPointWidth,
                  },
                  color: COLORS[i],
                })
                csvData.y2[i]?.name &&
                  values.push({
                    x: d.content,
                    y: csvData.y2[i].content,
                    type: 'scatter',
                    mode: graftType === 'line' ? 'lines' : 'markers',
                    name: `y2_${csvData.y2[i].name}`,
                    legendgroup: `${d.name}`,
                    yaxis: 'y2',
                    marker: {
                      color: COLORS[i],
                      size: lineOrPointWidth,
                    },
                    line: {
                      color: COLORS[i],
                      width: lineOrPointWidth,
                    },
                    color: COLORS[i],
                  })

                return values
              })
            )
          )

          setLayout({
            ...StaticValues({ drawerOpen: drawerOpen, width: width, height: height }),
            hovermode: 'closest',
            xaxis: {
              title: {
                text: csvData.x[0].name,
                font: {
                  size: 18,
                  color: '#7f7f7f',
                },
              },
            },
            yaxis: {
              title: {
                text: csvData.y[0].name,
                x: 0,
                font: {
                  size: 18,
                  color: '#7f7f7f',
                },
              },
            },
            yaxis2: {
              title: csvData.y2[0]?.name,
              overlaying: 'y',
              side: 'right',
              titlefont: { color: '#7f7f7f', size: 18 },
              tickfont: { color: '#7f7f7f' },
            },
          })
        } else {
          setData([])
          setLayout({})
        }
      } else {
        setLayout(StaticValues({ drawerOpen: drawerOpen, width: width, height: height }))
      }

      // set config and layout
      if (graftType === 'line') {
      } else if (graftType === 'scatter') {
      }
    }

    return () => {
      setLayout(null)
      setConfig({ scrollZoom: true })
      setData([])
    }
  }, [
    currentData,
    fileType,
    graftType,
    impedanceType,
    width,
    height,
    stepBetweenPoints,
    drawerOpen,
    csvFileColum,
    lineOrPointWidth,
  ])

  return { layout, config, data }
}

export default usePlotlyOptions
