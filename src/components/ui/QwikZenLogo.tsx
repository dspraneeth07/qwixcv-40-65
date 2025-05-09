
import { Link } from 'react-router-dom';

interface QwikZenLogoProps {
  size?: 'sm' | 'md' | 'lg';
}

const QwikZenLogo = ({ size = 'md' }: QwikZenLogoProps) => {
  const getLogoSize = () => {
    switch(size) {
      case 'sm': return 'h-6 w-6';
      case 'lg': return 'h-10 w-10';
      default: return 'h-8 w-8';
    }
  };

  return (
    <Link to="/" className="flex items-center">
      <img 
        src="/lovable-uploads/3265058c-5d87-416e-8812-a23917ab06ab.png" 
        alt="QwikZen Logo" 
        className={`${getLogoSize()} mr-2`}
      />
    </Link>
  );
};

export default QwikZenLogo;
