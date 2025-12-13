type AppInfoFormProps = {
  isCreatingTemplate: boolean;
  appName: string;
  setAppName: (name: string) => void;
  description: string;
  setDescription: (desc: string) => void;
  templateName: string;
  setTemplateName: (name: string) => void;
};

const AppInfoForm: React.FC<AppInfoFormProps> = (
  {
    isCreatingTemplate,
    appName,
    setAppName,
    description,
    setDescription,
    templateName,
    setTemplateName
  }
) => {
  return (<div className="bg-white rounded-xl shadow-md p-6">
    <h2 className="text-xl font-semibold text-gray-800 mb-4">
      {isCreatingTemplate ? 'Informações do Template' : 'Informações da Aplicação'}
    </h2>

    <div className="space-y-4">
      <div>
        <label htmlFor="appName" className="block text-sm font-medium text-gray-700 mb-2">
          {isCreatingTemplate ? 'Nome do Template *' : 'Nome da Aplicação *'}
        </label>
        <input
          type="text"
          id="appName"
          value={appName}
          onChange={(e) => setAppName(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          placeholder={isCreatingTemplate ? "Ex: Template de Acessibilidade Web" : "Ex: WhatsApp Web, Google Drive..."}
          required
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
          Descrição {!isCreatingTemplate && '(opcional)'}
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          placeholder={isCreatingTemplate ? "Descreva o propósito deste template..." : "Descreva a aplicação sendo avaliada..."}
          rows={2}
        />
      </div>

      {isCreatingTemplate && (
        <div>
          <label htmlFor="templateName" className="block text-sm font-medium text-gray-700 mb-2">
            Nome de Identificação *
          </label>
          <input
            type="text"
            id="templateName"
            value={templateName}
            onChange={(e) => setTemplateName(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="Ex: acessibilidade-web-v1"
            required
          />
          <p className="mt-1 text-sm text-gray-500">
            Este nome será usado para identificar o template
          </p>
        </div>
      )}
    </div>
  </div>);
};

export default AppInfoForm;