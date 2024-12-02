import '@/styles/components/shared/buttons/button-primary.scss';

interface ButtonPrimaryProps {
  text: string;
  icon?: React.ReactNode;
  colorType?: string;
  url?: string;
  className?: string;
}

const ButtonPrimary = ({
  text,
  icon,
  colorType = 'primary--light',
  url,
  className,
}: ButtonPrimaryProps) => {
  const buttonClassName = `button-primary ${colorType ? colorType : ''} ${className ? className : ''}`;

  if (url) {
    return (
      <a href={url} className={buttonClassName}>
        <span className='button-primary__text'>{text}</span>
        {icon && <span className='button-primary__icon'>{icon}</span>}
      </a>
    );
  }

  return (
    <button type='button' className={buttonClassName}>
      <span className='button-primary__text'>{text}</span>
      {icon && <span className='button-primary__icon'>{icon}</span>}
    </button>
  );
};

export default ButtonPrimary;
