import React, { useState } from 'react';
import { Settings } from 'lucide-react';
import AccessibilitySettingsModal from './AccessibilitySettingsModal';

const AccessibilitySettingsButton: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            <button
                onClick={() => setIsModalOpen(true)}
                className="fixed bottom-4 right-4 bg-primary-600 hover:bg-primary-700 text-white p-3 rounded-full shadow-lg transition-colors z-40"
                aria-label="Configurações de acessibilidade"
                title="Configurações de acessibilidade"
            >
                <Settings className="w-6 h-6" />
            </button>
            <AccessibilitySettingsModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </>
    );
};

export default AccessibilitySettingsButton;