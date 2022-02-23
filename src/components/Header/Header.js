// TODO: Convert this component into a functional component using memo or make it a pure component.

import React from 'react';
import _ from "lodash";
import PropTypes from 'prop-types';
import { Button, Row, Col, DatePicker, Icon, Input, message } from 'antd';
import jsonexport from 'jsonexport';
import csv from 'csv';
import moment from 'moment';
const { RangePicker, MonthPicker } = DatePicker





// TODO: What's this
const downloadCsv = (props) => jsonexport(props.data, (err, csv) => {
  if (err) { return console.log(err); }
  var element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(csv));
  element.setAttribute('download', `${props.filename}`);
  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
});


let fileInput = React.createRef();

const triggerInputFile = () => fileInput.current.click()

const readFile = async (element, props) => {
  const input = element.target;
  var filelist = input.files;
  const $promises = [];
  for (var i = 0; i < filelist.length; i++) {
    $promises.push(processFile(filelist[i]));
  }
  const receiptsData = {
    receipts: await Promise.all($promises)
  };
  input.value = '';
  props.bulkUpload(receiptsData)

}

const processFile = (file) => {
  return new Promise((resolve, reject) => {


    var reader = new FileReader();

    reader.onload = async () => {
      const validFormat = ["_id", "receipt_date", "retailer", "shop", "products", "category", "quantity", "amount", "deals", "amount spent", "saved amount", "receipt no"]
      await csv.parse(reader.result, (err, data) => {
        if (data && _.isEqual(data[0], validFormat)) {
          const newData = {};
          newData.receiptId = data[1][0]
          newData.receipt_date = new Date(data[1][1])
          newData.retailer_info = {
            retailer: data[1][2],
            shop: data[1][3]
          }
          newData.amountSpent = Number(data[1][9])
          newData.savedAmount = Number(data[1][10])
          newData.receipt_id = data[1][11]
          newData.status = 'Accepted'
          newData.deals = []
          newData.products = []
          for (let i = 1; i < data.length - 1; i++) {
            newData.products.push({
              product: data[i][4],
              category: data[i][5],
              quantity: data[i][6],
              amount: data[i][7],
            })

            if (data[i][8]) {
              newData.deals = [...newData.deals, data[i][8]]
            }
          }
          resolve(newData);
        } else {
          return message.warning('Please enter information with correct format')
        }
      });
    }

    reader.readAsBinaryString(file)
  })
}
const Header = (props) => {
  return (
    <Row gutter={12}>
      <Col lg={8} md={12} sm={16} xs={24} style={{ marginBottom: 16, marginTop: 5 }}>

        <div style={{ display: 'flex', height: 34 }}>
          <h2>{props.title}</h2>

          {props.showRefresh ?
            <Button
              type="primary"
              shape="circle"
              icon="sync"
              style={{ marginLeft: 10 }}
              className="refreshButton"
              onClick={props.onRefresh}
            />
            : null}
        </div>
      </Col>
      <Col lg={{ offset: 0, span: 16 }} md={12} sm={16} xs={24} style={{ marginBottom: 16, marginTop: 5, textAlign: 'right', display: 'flex', justifyContent: 'flex-end' }}>

        {props.showDateRange ?
          <RangePicker style={{ marginRight: 8 }} onChange={props.onChange()} format="YYYY-MM-DD" />
          : null
        }
        {props.showMonthPicker ?
          <MonthPicker style={{ marginRight: 8 }} value={props.mPickerValue} placeholder='Select Month' format='MMM' onChange={(date) => {
            const startOfMonth = moment(date._d).startOf('month').format();
            const endOfMonth = moment(date._d).endOf('month').format();
            const month = moment(date._d)
            if (date && date._d) {
              props.onChange({ monthNumber: moment(date._d).format('MM'), year: moment(date._d).format('YYYY'), startOfMonth, endOfMonth, month })
            } else {
              props.onChange({ monthNumber: moment().format('MM'), year: moment().format('YYYY') })
            }

          }} />
          : null
        }

        {props.showSearch ?
          <Input style={{ width: 250, marginRight: 8 }} prefix={<Icon type="search" />} placeholder='Search..' value={props.searchText}
            onChange={(e) => {
              props.onSearch(e.target.value);
            }}
          />
          : null}
        {props.showExportButton ? <Button className='headerButton' icon='download' style={{ marginRight: 8 }} type='primary' onClick={() => {
          downloadCsv(props)
        }}>
          Export to CSV
          </Button> : null}
        {props.showAddButton ?
          <Button type='primary' className='headerButton' loading={props.loading} onClick={props.onClick} icon='plus'>{props.label}</Button>
          : null}
        {props.downloadSelectedButton ?
          <Button type='primary' className='headerButton' onClick={props.onSelectedClick} >{props.selectButtonLabel}</Button>
          :
          null}
        {props.showUploadButton ?
          <div>
            <Button style={{ height: 32, }} onClick={triggerInputFile} type='primary'>
              <input id='fileinput' type="file" ref={fileInput} onChange={(event) => readFile(event, props)} style={{ display: 'none' }} multiple accept='.csv' />
              Upload csv
          </Button>
          </div>
          : null
        }
      </Col>
    </Row >
  );
}
export default Header

Header.propTypes = {
  data: PropTypes.array,
  filename: PropTypes.string,
  title: PropTypes.string,
  showRefresh: PropTypes.bool,
  showAddButton: PropTypes.bool,
  showSearch: PropTypes.bool,
  showDateRange: PropTypes.bool,
  onClick: PropTypes.func,
  onChange: PropTypes.func,
  onRefresh: PropTypes.func,
  searchText: PropTypes.string,
  onSearch: PropTypes.func,
  showExportButton: PropTypes.bool,
  loading: PropTypes.bool,
  label: PropTypes.string,
  showUploadButton: PropTypes.bool,
  downloadSelectedButton:PropTypes.bool,
  selectButtonLabel:PropTypes.string,
  onSelectedClick:PropTypes.func,
  showMonthPicker:PropTypes.bool,
  mPickerValue:PropTypes.string
}


