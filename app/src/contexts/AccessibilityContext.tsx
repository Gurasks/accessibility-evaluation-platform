import { createContext, useContext, useState, useEffect } from 'react';

export type FontSize = 'small' | 'medium' | 'large' | 'extra-large';
export type Theme = 'light' | 'dark';
export type FontFamily = 'default' | 'sans-serif' | 'serif' | 'monospace' | 'dyslexic';

interface AccessibilitySettings {
    fontSize: FontSize;
    theme: Theme;
    highContrast: boolean;
    fontFamily: FontFamily;
}

interface AccessibilityContextType {
    settings: AccessibilitySettings;
    updateFontSize: (size: FontSize) => void;
    updateTheme: (theme: Theme) => void;
    toggleTheme: () => void;
    toggleHighContrast: () => void;
    setHighContrast: (enabled: boolean) => void;
    updateFontFamily: (fontFamily: FontFamily) => void;
}

const AccessibilityContext = createContext<AccessibilityContextType>({} as AccessibilityContextType);

export const useAccessibility = () => useContext(AccessibilityContext);

export const AccessibilityProvider = ({ children }: { children: React.ReactNode }) => {
    const [settings, setSettings] = useState<AccessibilitySettings>({
        fontSize: 'medium',
        theme: 'light',
        highContrast: false,
        fontFamily: 'default'
    });

    // Load settings from localStorage on mount
    useEffect(() => {
        const savedSettings = localStorage.getItem('accessibility-settings');
        if (savedSettings) {
            try {
                const parsed = JSON.parse(savedSettings);
                setSettings(parsed);
            } catch (error) {
                console.error('Error parsing accessibility settings:', error);
            }
        }
    }, []);

    // Save settings to localStorage whenever they change
    useEffect(() => {
        localStorage.setItem('accessibility-settings', JSON.stringify(settings));
    }, [settings]);

    // Apply theme to document
    useEffect(() => {
        document.documentElement.setAttribute('data-theme', settings.theme);
    }, [settings.theme]);

    // Apply font size to document
    useEffect(() => {
        document.documentElement.setAttribute('data-font-size', settings.fontSize);
    }, [settings.fontSize]);

    // Apply high contrast to document
    useEffect(() => {
        if (settings.highContrast) {
            document.documentElement.setAttribute('data-high-contrast', 'true');
        } else {
            document.documentElement.removeAttribute('data-high-contrast');
        }
    }, [settings.highContrast]);

    // Apply font family to document
    useEffect(() => {
        document.documentElement.setAttribute('data-font-family', settings.fontFamily);
    }, [settings.fontFamily]);

    const updateFontSize = (size: FontSize) => {
        setSettings(prev => ({ ...prev, fontSize: size }));
    };

    const updateTheme = (theme: Theme) => {
        setSettings(prev => ({ ...prev, theme }));
    };

    const toggleTheme = () => {
        setSettings(prev => ({ ...prev, theme: prev.theme === 'light' ? 'dark' : 'light' }));
    };

    const toggleHighContrast = () => {
        setSettings(prev => ({ ...prev, highContrast: !prev.highContrast }));
    };

    const setHighContrast = (enabled: boolean) => {
        setSettings(prev => ({ ...prev, highContrast: enabled }));
    };

    const updateFontFamily = (fontFamily: FontFamily) => {
        setSettings(prev => ({ ...prev, fontFamily }));
    };

    const value = {
        settings,
        updateFontSize,
        updateTheme,
        toggleTheme,
        toggleHighContrast,
        setHighContrast,
        updateFontFamily
    };

    return (
        <AccessibilityContext.Provider value={value}>
            {children}
        </AccessibilityContext.Provider>
    );
};