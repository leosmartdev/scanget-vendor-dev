import React from 'react';
import { Card, } from 'antd';
import CountUp from 'react-countup';
import PropTypes from 'prop-types';

const NumberCard = ({ number, title, onClick, link }) => {
  return (
    <Card hoverable>
      <div className="raap-number-card" onClick={() => onClick(link)}>
        <div className="count"  >
          <div className="raap-count-title">{title}</div>
          <CountUp end={number} />
        </div>
      </div>
    </Card>
  );
}

NumberCard.propTypes = {
  number: PropTypes.number,
  title: PropTypes.string,
  onClick: PropTypes.func,
  link: PropTypes.string
}

export default NumberCard;