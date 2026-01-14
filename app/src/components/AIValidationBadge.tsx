import { AlertCircle, CheckCircle, Info, Lightbulb, Star } from 'lucide-react';
import React from 'react';

interface AIValidationBadgeProps {
  score: 1 | 2 | 3 | 4 | 5;
  feedback: string;
  strengths: string[];
  improvements: string[];
  validatedAt: Date;
  compact?: boolean;
}

const AIValidationBadge: React.FC<AIValidationBadgeProps> = ({
  score,
  feedback,
  strengths,
  improvements,
  validatedAt,
  compact = false
}) => {
  const getScoreConfig = (score: number) => {
    const configs = {
      5: {
        label: 'Excelente',
        color: 'bg-green-100 text-green-800 border-green-300',
        iconColor: 'text-green-600',
        Icon: Star
      },
      4: {
        label: 'Muito Bom',
        color: 'bg-lime-100 text-lime-800 border-lime-300',
        iconColor: 'text-lime-600',
        Icon: CheckCircle
      },
      3: {
        label: 'Bom',
        color: 'bg-yellow-100 text-yellow-800 border-yellow-300',
        iconColor: 'text-yellow-600',
        Icon: Info
      },
      2: {
        label: 'Adequado',
        color: 'bg-orange-100 text-orange-800 border-orange-300',
        iconColor: 'text-orange-600',
        Icon: AlertCircle
      },
      1: {
        label: 'Necessita Revisão',
        color: 'bg-red-100 text-red-800 border-red-300',
        iconColor: 'text-red-600',
        Icon: AlertCircle
      }
    };
    return configs[score as keyof typeof configs] || configs[3];
  };

  const config = getScoreConfig(score);
  const { Icon } = config;

  if (compact) {
    return (
      <div className={`inline-flex items-center space-x-2 px-3 py-1.5 rounded-full border ${config.color}`}>
        <Icon className={`w-4 h-4 ${config.iconColor}`} />
        <span className="text-sm font-medium">IA: {config.label}</span>
        <div className="flex space-x-0.5">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`w-3 h-3 ${star <= score ? 'fill-current' : ''} ${config.iconColor}`}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`rounded-lg border-2 ${config.color} p-6 space-y-4`}>
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg bg-white ${config.iconColor}`}>
            <Icon className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-semibold flex items-center space-x-2">
              <span>Validação por IA</span>
            </h3>
            <p className="text-sm opacity-75">
              Avaliação automática de acessibilidade cognitiva
            </p>
          </div>
        </div>
        <div className="text-right">
          <div className="flex items-center space-x-1 mb-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-5 h-5 ${star <= score ? 'fill-current' : ''} ${config.iconColor}`}
              />
            ))}
          </div>
          <p className="text-sm font-medium">{config.label}</p>
        </div>
      </div>

      {/* Feedback */}
      <div className="bg-white bg-opacity-50 rounded-lg p-4">
        <p className="text-sm leading-relaxed">{feedback}</p>
      </div>

      {/* Strengths */}
      {strengths.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <h4 className="text-sm font-semibold">Pontos Fortes</h4>
          </div>
          <ul className="space-y-1 pl-6">
            {strengths.map((strength, index) => (
              <li key={index} className="text-sm flex items-start">
                <span className="mr-2">✓</span>
                <span>{strength}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Improvements */}
      {improvements.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Lightbulb className="w-4 h-4 text-amber-600" />
            <h4 className="text-sm font-semibold">Sugestões de Melhoria</h4>
          </div>
          <ul className="space-y-1 pl-6">
            {improvements.map((improvement, index) => (
              <li key={index} className="text-sm flex items-start">
                <span className="mr-2">→</span>
                <span>{improvement}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Timestamp */}
      <div className="text-xs opacity-60 pt-2 border-t border-current border-opacity-20">
        Validado em: {new Date(validatedAt).toLocaleString('pt-BR')}
      </div>
    </div>
  );
};

export default AIValidationBadge;
