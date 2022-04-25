import PropTypes from 'prop-types';
import { BsHeart } from 'react-icons/bs';

const WishesCountStat = ({ totalWishes }) => (
  <div className="stat">
    <div className="stat-figure text-primary">
      <BsHeart className="stat-icon inline-block h-8 w-8 stroke-current" />
    </div>
    <div className="stat-title">Total Wishes Sent</div>
    <div className="stat-value text-primary">{totalWishes}</div>
  </div>
);

WishesCountStat.propTypes = {
  totalWishes: PropTypes.number.isRequired
};

export default WishesCountStat;
