import { Template } from "@/types";

type TemplateListProps = {
  predefinedTemplates: Template[];
};

const TemplateList: React.FC<TemplateListProps> = ({ predefinedTemplates }) => {
  return (
    <div className="space-y-6">
      {predefinedTemplates.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p>Nenhum template pré-definido disponível.</p>
        </div>
      ) : (
        predefinedTemplates.map(template => (
          <div key={template.id} className="border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="text-lg font-semibold text-gray-900">{template.name}</h4>
                <p className="text-sm text-gray-600">{template.description}</p>
              </div>
              <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-full">
                {template.category}
              </span>
            </div>

            <div className="space-y-3 mb-6">
              {template.questions.slice(0, 3).map((q: any, index: number) => (
                <div key={index} className="text-sm text-gray-700">
                  {index + 1}. {q.text}
                </div>
              ))}
              {template.questions.length > 3 && (
                <div className="text-sm text-gray-500">
                  + {template.questions.length - 3} mais perguntas...
                </div>
              )}
            </div>

            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-500">
                {template.questions.length} perguntas
              </div>
              <button
                onClick={() => {
                  // Implementar uso do template completo
                  const event = new CustomEvent('useTemplate', { detail: template.questions });
                  window.dispatchEvent(event);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Usar Template
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default TemplateList;