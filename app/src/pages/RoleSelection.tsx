import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, UserCheck } from 'lucide-react';

const RoleSelection: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Bem-vindo!
          </h1>
          <p className="text-gray-600">
            Escolha seu papel na plataforma
          </p>
        </div>

        <div className="space-y-4">
          <button
            onClick={() => navigate('/admin')}
            className="w-full flex items-center justify-center space-x-3 px-6 py-4 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            <Shield className="w-5 h-5" />
            <span className="text-lg font-medium">Sou ADM</span>
          </button>

          <button
            onClick={() => navigate('/evaluations')}
            className="w-full flex items-center justify-center space-x-3 px-6 py-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <UserCheck className="w-5 h-5" />
            <span className="text-lg font-medium">Sou Avaliador</span>
          </button>
        </div>

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>ADM: Cria e gerencia formulários de avaliação</p>
          <p>Avaliador: Responde avaliações de acessibilidade</p>
        </div>
      </div>
    </div>
  );
};

export default RoleSelection;