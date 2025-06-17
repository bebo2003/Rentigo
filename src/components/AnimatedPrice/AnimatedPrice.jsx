import PropTypes from 'prop-types';
const AnimatedDigit = ({ digit, delay }) => {
  return (
    <span
      className="inline-block animate-wave"
      style={{
        animationDelay: `${delay}s`
      }}
    >
      {digit}
    </span>
  );
};


AnimatedDigit.propTypes = {
  digit: PropTypes.number.isRequired,
  delay: PropTypes.number.isRequired,
};
const AnimatedPrice = ({ price }) => {
  return (
    <span className="absolute top-4 left-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg border-2 border-white flex">
      {price.toString().split('').map((digit, index) => (
        <AnimatedDigit key={index} digit={digit} delay={index * 0.1} />
      ))}
      <span className='ml-1'>EGP</span>
    </span>
  );
};

AnimatedPrice.propTypes = {
  price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

export default AnimatedPrice;
