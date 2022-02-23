import React from 'react';
import { Pie } from 'react-chartjs-2';
import PropTypes from 'prop-types'

const PieChart = (props) => {
  const data = {
    labels: [
      'Pending',
      'Processing',
      'Rejected',
      'Accepted'
    ],
    datasets: [{
      data: [...props.data],
      backgroundColor: [
        '#e4c742',
        '#7896e5',
        '#d8665e',
        '#a2e536'
      ],
      hoverBackgroundColor: [
        '#e4c742',
        '#7896e5',
        '#d8665e',
        '#a2e536'
      ]
    }]
  };
  return <Pie data={data} height={props.height ? props.height : 150} />
}

PieChart.propTypes = {
  data: PropTypes.array,
  height: PropTypes.number
};

export default PieChart;
