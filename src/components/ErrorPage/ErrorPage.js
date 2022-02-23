import React from 'react'
import PropTypes from 'prop-types';
import Img from '../../assets/images/error.svg'

const ErrorPage = ({ onClick, onRefresh }) => {
  return (
    <div className='ErrorPageContent'>
      <img src={Img} alt="" />
      <p>OOPS! Something went wrong, please try again or <a onClick={onClick}>report.</a></p>
      <button onClick={onRefresh} className='ReportButton'>RELOAD</button>
    </div >
  )
}

ErrorPage.propTypes = {
  onClick: PropTypes.func,
  onRefresh: PropTypes.func
}

export default ErrorPage