import * as React from "react";
import { init, getInstanceByDom } from "echarts";
import type { CSSProperties } from "react";
import type { ECharts, SetOptionOpts } from "echarts";

import useCharOptions from "../../hooks/useCharOptions";

export interface ReactEChartsProps {
  style?: CSSProperties;
  settings?: SetOptionOpts;
  loading?: boolean;
  theme?: "light" | "dark";
  title: string;
}

export const ReactECharts: React.FC<ReactEChartsProps> = ({
  style,
  settings,
  loading,
  theme,
  title
}): JSX.Element => {
  const chartRef = React.useRef<HTMLDivElement>(null);

  const { options: option } = useCharOptions({ type: "IMPEDANCE_ZiZr", title });

  React.useEffect(() => {
    // Initialize chart
    let chart: ECharts | undefined;
    if (chartRef.current !== null) {
      chart = init(chartRef.current, theme);
    }

    function resizeChart() {
      chart?.resize();
    }
    window.addEventListener("resize", resizeChart);

    // Return cleanup function
    return () => {
      chart.dispose();
      window.removeEventListener("resize", resizeChart);
    };
  }, [theme]);

  React.useEffect(() => {
    // Update chart
    // console.log(chartRef);
    if (chartRef.current !== null) {
      const chart = getInstanceByDom(chartRef.current);
      chart.clear();
      chart.setOption(option, settings);
    }
  }, [option, settings, theme]);

  React.useEffect(() => {
    // Update chart
    if (chartRef.current !== null) {
      const chart = getInstanceByDom(chartRef.current);
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      loading === true ? chart.showLoading() : chart.hideLoading();
    }
  }, [loading, theme]);

  return <div ref={chartRef} style={{ width: "100%", height: "500px", ...style }} />;
}