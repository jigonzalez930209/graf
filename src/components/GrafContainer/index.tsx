import * as React from 'react'
import Plotly from 'react-plotly.js';
import usePlotlyOptions from '../../hooks/usePlotlyOptions';


const PlotlyChart = () => {
  const { data, layout, config } = usePlotlyOptions()

  return (
    <Plotly
      data={data}
      layout={layout}
      config={config}
    />
  );
}

export default PlotlyChart;