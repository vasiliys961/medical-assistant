// frontend/src/components/medical/ECGAnalyzer.jsx
import React, { useState, useRef } from 'react';
import { uploadECG, analyzeECG } from '../../services/api';

const ECGAnalyzer = () => {
  const [ecgFile, setEcgFile] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setEcgFile(file);
      setError(null);
    }
  };

  const handleAnalyze = async () => {
    if (!ecgFile) {
      setError('Пожалуйста, выберите файл ЭКГ');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Загрузка файла
      const uploadResponse = await uploadECG(ecgFile);
      
      // Анализ ЭКГ
      const analysisResponse = await analyzeECG(uploadResponse.file_id);
      
      setAnalysis(analysisResponse);
    } catch (err) {
      setError(err.message || 'Ошибка при анализе ЭКГ');
    } finally {
      setLoading(false);
    }
  };

  const resetAnalysis = () => {
    setEcgFile(null);
    setAnalysis(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center mb-6">
        <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mr-4">
          <span className="text-2xl">📈</span>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Анализ ЭКГ</h2>
          <p className="text-gray-600">Загрузите файл ЭКГ для автоматического анализа</p>
        </div>
      </div>

      {/* Загрузка файла */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Файл ЭКГ (.txt, .csv, .dat)
        </label>
        <div className="flex items-center space-x-4">
          <input
            ref={fileInputRef}
            type="file"
            accept=".txt,.csv,.dat"
            onChange={handleFileSelect}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          <button
            onClick={handleAnalyze}
            disabled={!ecgFile || loading}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white px-6 py-2 rounded-lg transition-colors"
          >
            {loading ? 'Анализируется...' : 'Анализировать'}
          </button>
        </div>
      </div>

      {/* Индикатор загрузки */}
      {loading && (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <span className="ml-4 text-gray-600">Анализ ЭКГ в процессе...</span>
        </div>
      )}

      {/* Ошибка */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex">
            <span className="text-red-400 text-xl mr-3">⚠️</span>
            <div>
              <h3 className="text-red-800 font-medium">Ошибка</h3>
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Результаты анализа */}
      {analysis && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-800">Результаты анализа</h3>
            <button
              onClick={resetAnalysis}
              className="text-gray-500 hover:text-gray-700"
            >
              🔄 Новый анализ
            </button>
          </div>

          {/* Основные показатели */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="font-medium text-blue-800">ЧСС</h4>
              <p className="text-2xl font-bold text-blue-600">
                {analysis.heart_rate} уд/мин
              </p>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <h4 className="font-medium text-green-800">Ритм</h4>
              <p className="text-lg font-semibold text-green-600">
                {analysis.rhythm}
              </p>
            </div>
            <div className="bg-purple-50 rounded-lg p-4">
              <h4 className="font-medium text-purple-800">QT интервал</h4>
              <p className="text-lg font-semibold text-purple-600">
                {analysis.qt_interval} мс
              </p>
            </div>
          </div>

          {/* Диагноз и рекомендации */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h4 className="font-semibold text-gray-800 mb-3">Заключение</h4>
            <div className="space-y-3">
              <div>
                <span className="font-medium">Диагноз: </span>
                <span className={`px-3 py-1 rounded-full text-sm ${
                  analysis.diagnosis === 'Норма' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {analysis.diagnosis}
                </span>
              </div>
              <div>
                <span className="font-medium">Рекомендации: </span>
                <span className="text-gray-700">{analysis.recommendations}</span>
              </div>
            </div>
          </div>

          {/* График ЭКГ (если доступен) */}
          {analysis.chart_url && (
            <div className="bg-white border rounded-lg p-4">
              <h4 className="font-semibold text-gray-800 mb-3">График ЭКГ</h4>
              <img 
                src={analysis.chart_url} 
                alt="ECG Chart"
                className="w-full h-64 object-contain"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ECGAnalyzer;
