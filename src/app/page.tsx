
'use client';

import { useState, FormEvent, FC, ChangeEvent, useCallback } from 'react';



type PredictionResult = {
  diagnosis: string;
  probability_positive: number;
};

const initialPatientData = {
  Age: 75,
  Gender: 0,
  Ethnicity: 0,
  EducationLevel: 2,
  BMI: 28.5,
  Smoking: 0,
  AlcoholConsumption: 3.5,
  PhysicalActivity: 4,
  DietQuality: 6.5,
  SleepQuality: 7,
  FamilyHistoryAlzheimers: 1,
  CardiovascularDisease: 1,
  Diabetes: 0,
  Depression: 0,
  HeadInjury: 0,
  Hypertension: 1,
  SystolicBP: 140,
  DiastolicBP: 90,
  CholesterolTotal: 200,
  CholesterolLDL: 130,
  CholesterolHDL: 50,
  CholesterolTriglycerides: 150,
  MMSE: 25,
  FunctionalAssessment: 7,
  MemoryComplaints: 1,
  BehavioralProblems: 0,
  ADL: 8,
  Confusion: 0,
  Disorientation: 0,
  PersonalityChanges: 0,
  DifficultyCompletingTasks: 1,
  Forgetfulness: 1,
};



interface SliderProps {
  label: string;
  name: keyof typeof initialPatientData;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  unit?: string;
}

const SliderInput: FC<SliderProps> = ({ label, name, value, min, max, step = 0.1, onChange, unit = '' }) => (
  <div className="flex flex-col space-y-2">
    <label htmlFor={name} className="font-medium text-gray-300 text-sm">{label}</label>
    <div className="flex items-center space-x-4">
      <input
        type="range"
        id={name}
        name={name}
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={onChange}
        className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
      />
      <span className="font-semibold text-purple-400 w-24 text-center text-sm">{value} {unit}</span>
    </div>
  </div>
);

interface ToggleProps {
  label: string;
  name: keyof typeof initialPatientData;
  checked: boolean;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

const ToggleInput: FC<ToggleProps> = ({ label, name, checked, onChange }) => (
    <label htmlFor={name} className="flex items-center justify-between p-3 rounded-lg bg-slate-900 hover:bg-slate-800 transition-colors duration-200 cursor-pointer">
        <span className="font-medium text-gray-300 text-sm">{label}</span>
        <div className="relative">
            <input 
                type="checkbox" 
                id={name} 
                name={name}
                checked={checked}
                onChange={onChange}
                className="sr-only"
            />
            <div className={`block w-12 h-6 rounded-full transition-colors ${checked ? 'bg-purple-600' : 'bg-slate-700'}`}></div>
            <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${checked ? 'transform translate-x-6' : ''}`}></div>
        </div>
    </label>
);




export default function HomePage() {
  const [patientData, setPatientData] = useState(initialPatientData);
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setPatientData(prevData => ({
      ...prevData,
      [name]: type === 'checkbox' ? (checked ? 1 : 0) : parseFloat(value),
    }));
  };

  const handlePredict = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('http://127.0.0.1:8000/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patientData),
      });
      if (!response.ok) throw new Error('Falha na resposta da API.');
      const result = await response.json();
      setPrediction(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ocorreu um erro.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const toggleFields: Array<keyof typeof initialPatientData> = [
      'Gender', 'Smoking', 'FamilyHistoryAlzheimers', 'CardiovascularDisease',
      'Diabetes', 'Depression', 'HeadInjury', 'Hypertension', 'MemoryComplaints',
      'BehavioralProblems', 'Confusion', 'Disorientation', 'PersonalityChanges',
      'DifficultyCompletingTasks', 'Forgetfulness'
  ];
  const fieldLabels: Record<string, string> = {
    Gender: 'Gênero (1=M, 0=F)', Smoking: 'Fumante', FamilyHistoryAlzheimers: 'Hist. Familiar de Alzheimer',
    CardiovascularDisease: 'Doença Cardiovascular', Diabetes: 'Diabetes', Depression: 'Depressão',
    HeadInjury: 'Lesão na Cabeça', Hypertension: 'Hipertensão', MemoryComplaints: 'Queixas de Memória',
    BehavioralProblems: 'Problemas Comportamentais', Confusion: 'Confusão', Disorientation: 'Desorientação',
    PersonalityChanges: 'Mudanças de Personalidade', DifficultyCompletingTasks: 'Dificuldade em Tarefas',
    Forgetfulness: 'Esquecimento'
  };


  return (
    <main className="min-h-screen w-full bg-slate-900 text-white p-4 sm:p-6 lg:p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-8">
            <h1 className="text-4xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
                Painel Preditivo de Alzheimer
            </h1>
            <p className="mt-2 text-lg text-slate-400">Ajuste os parâmetros para simular um diagnóstico.</p>
        </header>

        <form onSubmit={handlePredict}>
            {/* Container para os formulários lado a lado */}
            <div className="flex flex-col lg:flex-row gap-8 mb-8">
                
                {/* Coluna 1: Sliders */}
                <div className="w-full lg:w-1/2 p-6 bg-slate-800 rounded-xl shadow-2xl border border-slate-700">
                    <h2 className="text-xl font-semibold text-purple-400 border-b border-slate-700 pb-3 mb-6">Dados Clínicos e Estilo de Vida</h2>
                    <div className="space-y-5">
                        <SliderInput label="Idade" name="Age" value={patientData.Age} min={40} max={100} step={1} onChange={handleChange} />
                        <SliderInput label="IMC" name="BMI" value={patientData.BMI} min={15} max={50} step={0.1} onChange={handleChange} />
                        <SliderInput label="Nível Educacional" name="EducationLevel" value={patientData.EducationLevel} min={0} max={4} step={1} onChange={handleChange} />
                        <SliderInput label="Consumo de Álcool (doses/semana)" name="AlcoholConsumption" value={patientData.AlcoholConsumption} min={0} max={20} step={0.5} onChange={handleChange} />
                        <SliderInput label="Atividade Física (horas/semana)" name="PhysicalActivity" value={patientData.PhysicalActivity} min={0} max={20} step={0.5} onChange={handleChange} />
                        <SliderInput label="Qualidade da Dieta (0-10)" name="DietQuality" value={patientData.DietQuality} min={0} max={10} step={0.5} onChange={handleChange} />
                        <SliderInput label="Qualidade do Sono (0-10)" name="SleepQuality" value={patientData.SleepQuality} min={0} max={10} step={0.5} onChange={handleChange} />
                        <SliderInput label="Pressão Sistólica (mmHg)" name="SystolicBP" value={patientData.SystolicBP} min={90} max={200} step={1} onChange={handleChange} />
                        <SliderInput label="Pressão Diastólica (mmHg)" name="DiastolicBP" value={patientData.DiastolicBP} min={60} max={120} step={1} onChange={handleChange} />
                        <SliderInput label="Colesterol Total (mg/dL)" name="CholesterolTotal" value={patientData.CholesterolTotal} min={100} max={300} step={1} onChange={handleChange} />
                        <SliderInput label="Colesterol LDL (mg/dL)" name="CholesterolLDL" value={patientData.CholesterolLDL} min={50} max={200} step={1} onChange={handleChange} />
                        <SliderInput label="Colesterol HDL (mg/dL)" name="CholesterolHDL" value={patientData.CholesterolHDL} min={20} max={100} step={1} onChange={handleChange} />
                        <SliderInput label="Triglicerídeos (mg/dL)" name="CholesterolTriglycerides" value={patientData.CholesterolTriglycerides} min={50} max={300} step={1} onChange={handleChange} />
                        <SliderInput label="MMSE (Pontuação)" name="MMSE" value={patientData.MMSE} min={0} max={30} step={1} onChange={handleChange} />
                        <SliderInput label="Avaliação Funcional (0-10)" name="FunctionalAssessment" value={patientData.FunctionalAssessment} min={0} max={10} step={1} onChange={handleChange} />
                        <SliderInput label="ADL (Pontuação)" name="ADL" value={patientData.ADL} min={0} max={10} step={1} onChange={handleChange} />
                    </div>
                </div>

                {/* Coluna 2: Toggles */}
                <div className="w-full lg:w-1/2 p-6 bg-slate-800 rounded-xl shadow-2xl border border-slate-700">
                    <h2 className="text-xl font-semibold text-purple-400 border-b border-slate-700 pb-3 mb-6">Histórico e Sintomas (Sim/Não)</h2>
                    <div className="space-y-4">
                        {toggleFields.map(field => (
                            <ToggleInput
                                key={field}
                                label={fieldLabels[field] || field}
                                name={field}
                                checked={patientData[field] === 1}
                                onChange={handleChange}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* Botão de Submissão */}
            <div className="text-center">
                <button type="submit" disabled={isLoading} className="px-12 py-4 text-lg font-bold text-white bg-purple-600 rounded-lg shadow-lg hover:bg-purple-700 focus:outline-none focus:ring-4 focus:ring-purple-400 focus:ring-opacity-50 disabled:bg-slate-600 disabled:cursor-not-allowed transition-all duration-300">
                    {isLoading ? 'A Processar...' : 'Gerar Diagnóstico'}
                </button>
            </div>
        </form>

        {/* Seção de Resultado */}
        <div className="mt-10 min-h-[150px]">
            {isLoading && (
                <div className="flex justify-center items-center h-full">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400"></div>
                </div>
            )}
            
            {error && (
                <div className="max-w-2xl mx-auto p-4 text-center text-red-300 bg-red-900 bg-opacity-30 border-2 border-red-500 rounded-lg">
                    <h3 className="text-xl font-bold">Erro na Predição</h3>
                    <p className="mt-2">{error}</p>
                </div>
            )}

            {/* --- INÍCIO DA MUDANÇA --- */}
            {prediction && !isLoading && (
                <div 
                    className={`
                        max-w-2xl mx-auto p-8 text-center rounded-xl shadow-2xl 
                        transition-all duration-500
                        ${prediction.diagnosis === 'Alzheimer Positivo' 
                            ? 'bg-red-900 bg-opacity-40 border-2 border-red-500' 
                            : 'bg-green-900 bg-opacity-40 border-2 border-green-500'
                        }
                    `}
                >
                    <h2 className="text-2xl font-semibold text-purple-300">Resultado da Análise</h2>
                    <p className={`my-3 text-5xl font-bold ${prediction.diagnosis === 'Alzheimer Positivo' ? 'text-red-400' : 'text-green-400'}`}>
                        {prediction.diagnosis}
                    </p>
                    <div className="text-slate-400">
                        Probabilidade (Positivo):
                        <span className="font-bold text-lg text-white ml-2">
                            {(prediction.probability_positive * 100).toFixed(2)}%
                        </span>
                    </div>
                </div>
            )}
            {/* --- FIM DA MUDANÇA --- */}
        </div>

      </div>
    </main>
  );
}