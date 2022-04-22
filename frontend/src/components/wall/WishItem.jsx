import React from 'react';
import PropTypes from 'prop-types';
import { BiLinkExternal } from 'react-icons/bi';

const WishItem = ({ wish }) => (
  <div className="card w-96 bg-neutral text-neutral-content">
    <div className="card-body items-center text-center">
      <h2 className="card-title">{wish.timestamp.toLocaleString()}</h2>
      <p>{wish.message}</p>
      <a
        href={`https://etherscan.io/address/${wish.owner}`}
        target="_blank"
        className="link-neutral link text-slate-50 hover:text-slate-100"
        rel="noopener noreferrer">
        owner
        <BiLinkExternal className="inline-block h-4 w-4 stroke-current" />
      </a>
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
