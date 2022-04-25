import PropTypes from 'prop-types';
import { CgArrowsExchangeV } from 'react-icons/cg';

const VotesCountStat = ({ totalVotes }) => (
  <div className="stat">
    <div className="stat-figure text-secondary">
      <CgArrowsExchangeV className="stat-icon inline-block h-8 w-8 stroke-current" />
    </div>
    <div className="stat-title">Total Votes Made</div>
    <div className="stat-value text-secondary">{totalVotes}</div>
  </div>
);

VotesCountStat.propTypes = {
  totalVotes: PropTypes.number.isRequired
};

export default VotesCountStat;
