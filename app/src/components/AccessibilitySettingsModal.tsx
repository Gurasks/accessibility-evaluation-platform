import React, { useState } from 'react';
import { Settings, X } from 'lucide-react';
import { useAccessibility, FontSize, Theme, FontFamily } from '../contexts/AccessibilityContext';

interface AccessibilitySettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const AccessibilitySettingsModal: React.FC<AccessibilitySettingsModalProps> = ({ isOpen, onClose }) => {
    const { settings, updateFontSize, updateTheme, toggleHighContrast, updateFontFamily } = useAccessibility();

    if (!isOpen) return null;

    const fontSizeOptions: { value: FontSize; label: string }[] = [
        { value: 'small', label: 'Pequena' },
        { value: 'medium', label: 'Média' },
        { value: 'large', label: 'Grande' },
        { value: 'extra-large', label: 'Enorme' }
    ];

    const themeOptions: { value: Theme; label: string }[] = [
        { value: 'light', label: 'Claro' },
        { value: 'dark', label: 'Escuro' }
    ];

    const fontFamilyOptions: { value: FontFamily; label: string; preview: string }[] = [
        { value: 'default', label: 'Padrão', preview: 'Inter, sans-serif' },
        { value: 'sans-serif', label: 'Sans Serif', preview: 'Arial, sans-serif' },
        { value: 'serif', label: 'Serif', preview: 'Times New Roman, serif' },
        { value: 'monospace', label: 'Monospace', preview: 'Courier New, monospace' },
        { value: 'dyslexic', label: 'Para Dislexia', preview: 'OpenDyslexic, sans-serif' }
    ];

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full max-h-[90vh] flex flex-col">
                <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Configurações de Acessibilidade
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {/* Tamanho da Fonte */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                            Tamanho da Fonte
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                            {fontSizeOptions.map((option) => (
                                <button
                                    key={option.value}
                                    onClick={() => updateFontSize(option.value)}
                                    className={`px-4 py-2 text-sm font-medium rounded-md border transition-colors ${settings.fontSize === option.value
                                        ? 'bg-primary-600 text-white border-primary-600'
                                        : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'
                                        }`}
                                >
                                    {option.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Tema */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                            Tema
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                            {themeOptions.map((option) => (
                                <button
                                    key={option.value}
                                    onClick={() => updateTheme(option.value)}
                                    className={`px-4 py-2 text-sm font-medium rounded-md border transition-colors ${settings.theme === option.value
                                        ? 'bg-primary-600 text-white border-primary-600'
                                        : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'
                                        }`}
                                >
                                    {option.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Alto Contraste */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                            Alto Contraste
                        </label>
                        <div className="flex items-center">
                            <button
                                onClick={toggleHighContrast}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${settings.highContrast ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-600'
                                    }`}
                            >
                                <span
                                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.highContrast ? 'translate-x-6' : 'translate-x-1'
                                        }`}
                                />
                            </button>
                            <span className="ml-3 text-sm text-gray-700 dark:text-gray-300">
                                {settings.highContrast ? 'Ativado' : 'Desativado'}
                            </span>
                        </div>
                        <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                            Aumenta o contraste entre texto e fundo para melhor legibilidade
                        </p>
                    </div>

                    {/* Família da Fonte */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                            Família da Fonte
                        </label>
                        <div className="space-y-2">
                            {fontFamilyOptions.map((option) => (
                                <button
                                    key={option.value}
                                    onClick={() => updateFontFamily(option.value)}
                                    className={`w-full text-left px-4 py-3 rounded-md border transition-all ${settings.fontFamily === option.value
                                        ? 'bg-primary-600 text-white border-primary-600'
                                        : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'
                                        }`}
                                    style={{ fontFamily: option.preview }}
                                >
                                    <div className="font-medium">{option.label}</div>
                                    <div className="text-sm opacity-75 mt-1" style={{ fontFamily: option.preview }}>
                                        {option.preview}
                                    </div>
                                </button>
                            ))}
                        </div>
                        <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                            Escolha uma fonte que seja mais confortável para você
                        </p>
                    </div>

                    <div className="flex justify-end p-6 border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
                        >
                            Fechar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AccessibilitySettingsModal;