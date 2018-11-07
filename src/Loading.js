import React from 'react';
import { Fade } from 'reactstrap';

const Loading = ({ reports }) => (
  <Fade>
    <div className="text-center text-black-50">
      <small className="text-muted">
        <i>loading...</i>
      </small>
    </div>
  </Fade>
);

export default Loading;
