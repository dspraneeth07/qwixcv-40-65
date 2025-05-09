
import { Link } from 'react-router-dom';

interface QwikZenLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  variant?: 'white' | 'default';
}

const QwikZenLogo = ({ size = 'md', showText = true, variant = 'default' }: QwikZenLogoProps) => {
  const getLogoSize = () => {
    switch(size) {
      case 'sm': return 'h-6 w-6';
      case 'lg': return 'h-10 w-10';
      default: return 'h-8 w-8';
    }
  };

  const getTextSize = () => {
    switch(size) {
      case 'sm': return 'text-base';
      case 'lg': return 'text-2xl';
      default: return 'text-lg';
    }
  };

  const textColor = variant === 'white' 
    ? 'text-white' 
    : 'bg-gradient-to-r from-modern-blue-500 to-soft-purple bg-clip-text text-transparent';

  return (
    <Link to="/" className="flex items-center">
      <div className="flex items-center">
        <img 
          src="/lovable-uploads/f5d06c81-a24b-4c51-8bf0-c6fd139438e3.png" 
          alt="Founder Image" 
          className={`${getLogoSize()} mr-2 rounded-full border-2 ${variant === 'white' ? 'border-white' : 'border-modern-blue-200'}`}
        />
        <img 
          src="/lovable-uploads/3265058c-5d87-416e-8812-a23917ab06ab.png" 
          alt="QwikZen Logo" 
          className={`${getLogoSize()} mr-2`}
        />
        {showText && (
          <div className={`${getTextSize()} font-bold ${textColor} font-sf-pro`}>
            QwikZen
          </div>
        )}
      </div>
    </Link>
  );
};

export default QwikZenLogo;
