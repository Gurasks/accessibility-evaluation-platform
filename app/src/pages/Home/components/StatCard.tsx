import { ReactNode } from 'react';

type StatCardProps = {
  title: string;
  value: string | number;
  icon?: ReactNode;
  highlight?: boolean;
};

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  highlight = false
}) => {
  return (
    <div
      className={`
        bg-white rounded-xl p-6 shadow-sm border
        ${highlight ? 'border-primary-500' : 'border-gray-200'}
      `}
      role="region"
      aria-label={title}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            {value}
          </p>
        </div>

        {icon && (
          <div
            className="text-primary-600"
            aria-hidden="true"
          >
            {icon}
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;