import React from 'react';
import PropTypes from 'prop-types';

const WishItem = ({ wish }) => (
  <div className="card w-96 bg-neutral text-neutral-content">
    <div className="card-body items-center text-center">
      <h2 className="card-title">{wish.timestamp.toLocaleString()}</h2>
      <p>{wish.message}</p>
    </div>
  </div>
);

WishItem.propTypes = {
  wish: PropTypes.exact({
    id: PropTypes.number.isRequired,
    owner: PropTypes.string.isRequired,
    timestamp: PropTypes.instanceOf(Date).isRequired,
    message: PropTypes.string.isRequired
  }).isRequired
};

export default WishItem;
