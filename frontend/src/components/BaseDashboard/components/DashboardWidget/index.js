import React, { useEffect } from "react";
import "./DashboardWidget.scss";
import PropTypes from "prop-types";
import Chart from "../../../Chart";
import Percentage from "../Percentage";
import DoughnutChartConfig from "./DoughnutChartConfig";

const DashboardWidget = ({ title, data, ...extraProps }) => {
  const chartRef = React.createRef();
  const chartLineRef = React.createRef();
  const isSuccess = data[data.length - 1] <= data[data.length - 2];

  const randomIntFromInterval = (min, max) => {
    // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min);
  };

  const getDoughnutChartConfig = () => {
    const doughnutChartConfig = DoughnutChartConfig;
    const sum = data.reduce((a, b) => a + b, 0);
    const random = randomIntFromInterval(sum, (sum * 1) / 2);
    doughnutChartConfig.data = {
      labels: ["Red flag", ""],
      datasets: [
        {
          data: [data.reduce((a, b) => a + b, 0), random],
          backgroundColor: ["#F2994A", "#6B6B6B"],
          borderWidth: 0,
          label: "Score"
        }
      ]
    };
    doughnutChartConfig.options.elements.center.text = sum;

    return doughnutChartConfig;
  };

  const getLineChartConfig = myChartLineRef => {
    const gradient = myChartLineRef.createLinearGradient(0, 0, 0, 150);
    if (isSuccess) {
      gradient.addColorStop(0, "#0c7a03");
      gradient.addColorStop(0.5, "#3ff707");
      gradient.addColorStop(1, "#fff");
    } else {
      gradient.addColorStop(0, "rgba(255, 0, 0, 0.25)");
      gradient.addColorStop(0.5, "rgba(255, 0,0, 0.5)");
      gradient.addColorStop(1, "#fff");
    }

    const config = {
      type: "line",
      data: {
        labels: data,
        datasets: [
          {
            data: data,
            label: "North America",
            backgroundColor: gradient,
            pointBackgroundColor: gradient,
            borderWidth: 1,
            borderColor: gradient,
            lineTension: 0
          }
        ]
      },
      options: {
        legend: false,
        elements: {
          point: {
            radius: 0
          }
        },
        scales: {
          xAxes: [
            {
              display: false
            }
          ],
          yAxes: [
            {
              display: false
            }
          ]
        },
        title: {
          display: false
        }
      }
    };

    return config;
  };

  useEffect(() => {
    const myChartRef = chartRef.current.getContext("2d");
    const myChartLineRef = chartLineRef.current.getContext("2d");

    new Chart(myChartRef, getDoughnutChartConfig());
    new Chart(myChartLineRef, getLineChartConfig(myChartLineRef));
  });

  return (
    <div className={["column", "widget"].join(" ")} {...extraProps}>
      <div className="columns is-mobile">
        <div className="column is-6 doughnut-chart ">
          <canvas ref={chartRef} width="200" height="100" />
        </div>
        <div className="column is-6 info">
          <p className="widget-title">{title}</p>
          <div className="columns is-mobile">
            <div className="column is-4 percentage">
              <Percentage value={29} success={isSuccess} />
            </div>
            <div className="column is-8">
              <div className="myChart2Wrapper">
                <canvas
                  id="myChart2"
                  ref={chartLineRef}
                  width="200"
                  height="100"
                />
                <div className="shadow" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

DashboardWidget.propTypes = {
  title: PropTypes.string,
  data: PropTypes.arrayOf(PropTypes.number)
};

export default DashboardWidget;
