import React from 'react';
import { Collapse, Button, Popconfirm } from 'antd';
import { connect } from 'react-redux';
import { openModal } from '../../actions/modal.action';
import PropTypes from 'prop-types'
const Panel = Collapse.Panel;

const Question = (props) => {
  return (
    <Collapse>
      <Panel header={props.title}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <p style={{ whiteSpace: 'pre-line', paddingRight: 5 }}>{props.text}</p>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <Button size='small' icon="edit" style={{ marginBottom: 10 }} onClick={() => {
              props.setCurrentFAQ(props.currentFAQ)
              props.openModal('question-modal')
            }} />
            <Popconfirm title="Are you sure delete this FAQ?" onConfirm={() => props.onDelete(props.id, props.allFAQs)} okText="Yes" cancelText="No">
              <Button size='small' icon='delete' />
            </Popconfirm>
          </div>
        </div>
      </Panel>
    </Collapse>
  )
}
Question.propTypes = {
  title: PropTypes.string,
  setCurrentFAQ: PropTypes.func,
  currentFAQ: PropTypes.object,
  text: PropTypes.string,
  onDelete: PropTypes.func,
  id: PropTypes.string,
  allFAQs: PropTypes.array,
  openModal: PropTypes.array,
}
export default connect(null, { openModal })(Question)