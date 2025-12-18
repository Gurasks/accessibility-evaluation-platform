import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { UserPlus, Mail, Lock, User, Eye, EyeOff, Check, X } from 'lucide-react';
// Olhar melhor esse arquivo
const Signup: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    role: 'evaluator' as 'adm' | 'evaluator'
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [passwordRequirements, setPasswordRequirements] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false
  });

  const { signup } = useAuth();
  const navigate = useNavigate();

  const validatePassword = (password: string) => {
    const requirements = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(password)
    };
    setPasswordRequirements(requirements);
    return Object.values(requirements).every(req => req);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (name === 'password') {
      validatePassword(value);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validações
    if (formData.password !== formData.confirmPassword) {
      return setError('As senhas não coincidem');
    }

    if (!validatePassword(formData.password)) {
      return setError('A senha não atende todos os requisitos');
    }

    if (!formData.name.trim()) {
      return setError('Por favor, insira seu nome');
    }

    try {
      setError('');
      setSuccess('');
      setLoading(true);

      await signup(formData.email, formData.password, formData.name, formData.role);

      setSuccess('Conta criada com sucesso! Redirecionando...');

      // Redireciona após 2 segundos
      setTimeout(() => {
        navigate('/');
      }, 2000);

    } catch (err: any) {
      console.error('Signup error:', err);

      // Mensagens de erro específicas do Firebase
      if (err.code === 'auth/email-already-in-use') {
        setError('Este email já está em uso. Tente fazer login.');
      } else if (err.code === 'auth/invalid-email') {
        setError('Email inválido. Por favor, verifique.');
      } else if (err.code === 'auth/weak-password') {
        setError('Senha muito fraca. Use uma senha mais forte.');
      } else if (err.code === 'auth/network-request-failed') {
        setError('Erro de conexão. Verifique sua internet.');
      } else {
        setError('Falha ao criar conta. Tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  const PasswordRequirement = ({
    met,
    text
  }: {
    met: boolean;
    text: string
  }) => (
    <div className="flex items-center space-x-2">
      {met ? (
        <Check className="w-4 h-4 text-green-500" />
      ) : (
        <X className="w-4 h-4 text-red-500" />
      )}
      <span className={`text-sm ${met ? 'text-green-600' : 'text-gray-500'}`}>
        {text}
      </span>
    </div>
  );

  const allRequirementsMet = Object.values(passwordRequirements).every(req => req);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white rounded-2xl shadow-xl p-8">
        <div>
          <div className="flex justify-center">
            <div className="bg-primary-100 p-3 rounded-full">
              <UserPlus className="w-12 h-12 text-primary-600" />
            </div>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Criar Nova Conta
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Ou{' '}
            <Link
              to="/login"
              className="font-medium text-primary-600 hover:text-primary-500 transition-colors"
            >
              acessar sua conta existente
            </Link>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg animate-pulse">
              <div className="flex items-center">
                <X className="w-5 h-5 mr-2" />
                {error}
              </div>
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg animate-pulse">
              <div className="flex items-center">
                <Check className="w-5 h-5 mr-2" />
                {success}
              </div>
            </div>
          )}

          <div className="space-y-4">
            {/* Nome */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Nome Completo
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="appearance-none rounded-lg relative block w-full pl-10 px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                  placeholder="Seu nome completo"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="appearance-none rounded-lg relative block w-full pl-10 px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                  placeholder="seu@email.com"
                />
              </div>
            </div>

            {/* Senha */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Senha
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="appearance-none rounded-lg relative block w-full pl-10 pr-10 px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>

              {/* Requisitos da senha */}
              {formData.password && (
                <div className="mt-3 space-y-2 p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium text-gray-700">A senha deve conter:</p>
                  <div className="grid grid-cols-2 gap-2">
                    <PasswordRequirement
                      met={passwordRequirements.length}
                      text="Mínimo 8 caracteres"
                    />
                    <PasswordRequirement
                      met={passwordRequirements.uppercase}
                      text="Letra maiúscula"
                    />
                    <PasswordRequirement
                      met={passwordRequirements.lowercase}
                      text="Letra minúscula"
                    />
                    <PasswordRequirement
                      met={passwordRequirements.number}
                      text="Número"
                    />
                    <PasswordRequirement
                      met={passwordRequirements.special}
                      text="Caractere especial"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Confirmar Senha */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Confirmar Senha
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`appearance-none rounded-lg relative block w-full pl-10 pr-10 px-3 py-3 border ${formData.confirmPassword && formData.password !== formData.confirmPassword
                    ? 'border-red-300'
                    : 'border-gray-300'
                    } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>

              {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <X className="w-4 h-4 mr-1" />
                  As senhas não coincidem
                </p>
              )}

              {formData.confirmPassword && formData.password === formData.confirmPassword && formData.password && (
                <p className="mt-1 text-sm text-green-600 flex items-center">
                  <Check className="w-4 h-4 mr-1" />
                  Senhas coincidem
                </p>
              )}
            </div>
          </div>

          {/* Tipo de Usuário */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Tipo de Usuário
            </label>
            <div className="space-y-2">
              <div className="flex items-center">
                <input
                  id="evaluator"
                  name="role"
                  type="radio"
                  value="evaluator"
                  checked={formData.role === 'evaluator'}
                  onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value as 'adm' | 'evaluator' }))}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                />
                <label htmlFor="evaluator" className="ml-3 block text-sm font-medium text-gray-700">
                  Avaliador - Responder avaliações de acessibilidade
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="adm"
                  name="role"
                  type="radio"
                  value="adm"
                  checked={formData.role === 'adm'}
                  onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value as 'adm' | 'evaluator' }))}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                />
                <label htmlFor="adm" className="ml-3 block text-sm font-medium text-gray-700">
                  ADM - Criar e gerenciar formulários de avaliação
                </label>
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading || !allRequirementsMet || formData.password !== formData.confirmPassword}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02]"
            >
              <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                {!loading && <UserPlus className="h-5 w-5 text-primary-300" />}
              </span>
              {loading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Criando conta...
                </span>
              ) : (
                'Criar Conta'
              )}
            </button>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Já tem uma conta?{' '}
              <Link
                to="/login"
                className="font-medium text-primary-600 hover:text-primary-500 transition-colors"
              >
                Faça login aqui
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;