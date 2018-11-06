import React, { useContext } from 'react';
import { Row, Col, ListGroup } from 'reactstrap';
import { ChangeReportDispatch } from '../Inbox';

const Reports = ({ reports }) => {
  const dispatch = useContext(ChangeReportDispatch);
  return (
    <ListGroup flush className="mr-2 pl-2">
      {reports.edges.map(({ node: report }) => (
        <span
          key={report.id}
          onClick={() => dispatch({ type: 'changeReport', payload: report.id })}
          className="p-0 list-group-item list-group-item-action"
        >
          <Row className="p-0 py-3 mx-0">
            <Col>
              <img
                className="rounded-circle float-left mr-3 mt-2"
                src={report.team.profilePicture}
                style={{ height: '35px' }}
              />

              <div>
                <span className="text-dark" href="#">
                  Report Title
                </span>
                <div>
                  <small className="text-muted">
                    x
                    {' '}
                    {report.databaseId}
                    {' | '}
                    <span>
                      by
                      {report.reporter.username}
                    </span>
                    {' | '}
                    <span>
                      to
                      {report.team.name}
                    </span>
                  </small>
                </div>
              </div>
            </Col>
          </Row>
        </span>
      ))}
    </ListGroup>
  );
};

export default Reports;
