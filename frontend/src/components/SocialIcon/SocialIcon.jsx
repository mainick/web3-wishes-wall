import PropTypes from 'prop-types';
import GitHub from './github.svg';
import Twitter from './twitter.svg';
import Linkedin from './linkedin.svg';
import PersonalBlog from './blog.svg';

const components = {
  github: GitHub,
  twitter: Twitter,
  linkedin: Linkedin,
  blog: PersonalBlog
};

const SocialIcon = ({ kind, url }) => {
  if (!kind || !url) {
    return null;
  }
  return (
    <a
      href={url}
      target="_blank"
      className="text-sm text-gray-500 transition hover:text-gray-600"
      rel="noopener noreferrer">
      <img alt={kind} src={components[kind]} className="h-8 w-8 fill-current" />
    </a>
  );
};

SocialIcon.propTypes = {
  kind: PropTypes.oneOf(['github', 'twitter', 'linkedin', 'blog']).isRequired,
  url: PropTypes.string.isRequired
};

export default SocialIcon;
