'use client';

import React, { useState } from 'react';
import { ChevronDown as ChevronDownIcon, Sparkles as SparklesIcon } from 'lucide-react';
import { AI_MODELS, MODEL_CATEGORIES, DEFAULT_MODEL } from '@/lib/ai-models';

interface ModelSelectorProps {
  selectedModel: string;
  onModelChange: (modelId: string) => void;
  className?: string;
}

export const ModelSelector: React.FC<ModelSelectorProps> = ({
  selectedModel,
  onModelChange,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  const currentModel = AI_MODELS.find(m => m.id === selectedModel) || 
                      AI_MODELS.find(m => m.id === DEFAULT_MODEL)!;

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      "🔥 Latest Models": "🔥",
      "🧠 Reasoning": "🧠", 
      "🎭 Creative": "🎭",
      "💻 Coding": "💻",
      "💎 Multimodal": "💎",
      "⚡ Conversational": "⚡",
      "🆓 Free Models": "🆓"
    };
    return icons[category] || "🤖";
  };

  const getTierBadge = (tier: string) => {
    return tier === 'premium' ? (
      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">
        <SparklesIcon className="w-3 h-3 mr-1" />
        Premium
      </span>
    ) : (
      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
        🆓 Free
      </span>
    );
  };

  return (
    <div className={`relative ${className}`}>
      {/* Current Selection */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-3 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      >
        <div className="flex items-center space-x-3">
          <span className="text-lg">🤖</span>
          <div className="text-left">
            <div className="font-medium text-gray-900 text-sm">{currentModel.name}</div>
            <div className="text-xs text-gray-500">{currentModel.description}</div>
          </div>
          {getTierBadge(currentModel.tier)}
        </div>
        <ChevronDownIcon className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-96 overflow-y-auto">
          {Object.entries(MODEL_CATEGORIES).map(([categoryName, models]) => (
            <div key={categoryName} className="border-b border-gray-100 last:border-b-0">
              <button
                onClick={() => setSelectedCategory(selectedCategory === categoryName ? '' : categoryName)}
                className="w-full px-3 py-2 text-left text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center justify-between"
              >
                <span className="flex items-center space-x-2">
                  <span>{getCategoryIcon(categoryName)}</span>
                  <span>{categoryName}</span>
                </span>
                <span className="text-xs text-gray-500">({(models as any[]).length})</span>
              </button>
              
              {selectedCategory === categoryName && (
                <div className="bg-gray-50">
                  {(models as any[]).map((model: any) => (
                    <button
                      key={model.id}
                      onClick={() => {
                        onModelChange(model.id);
                        setIsOpen(false);
                        setSelectedCategory('');
                      }}
                      className={`w-full px-6 py-2 text-left text-sm hover:bg-blue-50 flex items-center justify-between ${
                        selectedModel === model.id ? 'bg-blue-100 border-l-2 border-blue-500' : ''
                      }`}
                    >
                      <div>
                        <div className="font-medium">{model.name}</div>
                        {model.description && (
                          <div className="text-xs text-gray-500">{model.description}</div>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        {getTierBadge(model.tier)}
                        {model.maxTokens && (
                          <span className="text-xs text-gray-400">{model.maxTokens}</span>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};