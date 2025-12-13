import { QuestionFiltersTabs } from "@/types";
import { CogaOptions } from "@/types/coga";
import { Search } from "lucide-react";

type QuestionFiltersProps = {
  cogaCategories: CogaOptions;
  setActiveTab: (tab: QuestionFiltersTabs) => void;
  activeTab: QuestionFiltersTabs;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
};

const QuestionFilters: React.FC<QuestionFiltersProps> = ({
  cogaCategories,
  setActiveTab,
  activeTab,
  searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory
}) => {

  return (
    <div className="p-6 border-b border-gray-200 bg-gray-50">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Tabs */}
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('mine')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'mine' ? 'bg-white text-primary-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
          >
            Minhas Perguntas
          </button>
          <button
            onClick={() => setActiveTab('public')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'public' ? 'bg-white text-primary-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
          >
            Perguntas Públicas
          </button>
          <button
            onClick={() => setActiveTab('templates')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'templates' ? 'bg-white text-primary-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
          >
            Templates
          </button>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar perguntas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="all">Todas categorias</option>
            {Object.values(cogaCategories).map(cat => (
              <option key={cat.key} value={cat.label}>{cat.label}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  )
}

export default QuestionFilters;