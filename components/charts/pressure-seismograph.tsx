"use client"

import { useState, useEffect, useRef } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { type Block } from '@/lib/mock-data'

interface PressureSeismographProps {
  selectedBlock: Block | null
}

interface PressureDataPoint {
  time: number
  pressure: number
  timestamp: string
}

export function PressureSeismograph({ selectedBlock }: PressureSeismographProps) {
  const [isClient, setIsClient] = useState(false)
  const [pressureData, setPressureData] = useState<PressureDataPoint[]>([])
  const timeCounterRef = useRef(0)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    setIsClient(true)
  }, [])

  // Função para gerar valor de pressão realista com padrão ondulado
  const generatePressureValue = (time: number, baseIntensity: number): number => {
    // Onda senoidal principal (frequência baixa)
    const mainWave = Math.sin(time * 0.3) * 15
    
    // Onda de alta frequência (simulando passos)
    const highFreqWave = Math.sin(time * 2) * 8
    
    // Ruído aleatório pequeno
    const noise = (Math.random() - 0.5) * 5
    
    // Picos ocasionais (simulando pessoas caminhando)
    const spike = Math.random() > 0.85 ? Math.random() * 20 : 0
    
    // Valor base ajustado pela integridade do bloco
    const baseValue = baseIntensity
    
    const totalPressure = baseValue + mainWave + highFreqWave + noise + spike
    
    // Limitar entre 0 e 100
    return Math.max(0, Math.min(100, totalPressure))
  }

  // Inicializar dados quando um bloco é selecionado
  useEffect(() => {
    if (!selectedBlock) {
      setPressureData([])
      timeCounterRef.current = 0
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
      return
    }

    // Calcular intensidade base a partir da integridade (blocos com menor integridade têm mais variação)
    const baseIntensity = 50 + (100 - selectedBlock.integrity) * 0.3

    // Gerar dados iniciais (últimos 30 pontos)
    const initialData: PressureDataPoint[] = []
    for (let i = -30; i <= 0; i++) {
      initialData.push({
        time: i,
        pressure: generatePressureValue(i, baseIntensity),
        timestamp: `${i}s`
      })
    }
    setPressureData(initialData)
    timeCounterRef.current = 1

    // Atualizar dados a cada 1 segundo
    intervalRef.current = setInterval(() => {
      setPressureData(prevData => {
        const newTime = timeCounterRef.current
        const newPoint: PressureDataPoint = {
          time: newTime,
          pressure: generatePressureValue(newTime, baseIntensity),
          timestamp: `${newTime}s`
        }

        // Manter apenas os últimos 30 segundos (30 pontos a 1Hz)
        const updatedData = [...prevData, newPoint].slice(-30)
        timeCounterRef.current += 1
        
        return updatedData
      })
    }, 1000)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [selectedBlock])

  // Calcular estatísticas
  const currentPressure = pressureData.length > 0 ? pressureData[pressureData.length - 1].pressure : 0
  const avgPressure = pressureData.length > 0 
    ? Math.round(pressureData.reduce((sum, p) => sum + p.pressure, 0) / pressureData.length)
    : 0
  const maxPressure = pressureData.length > 0
    ? Math.round(Math.max(...pressureData.map(p => p.pressure)))
    : 0

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-semibold text-gray-900">Pressão em Tempo Real</h3>

        </div>
        {selectedBlock && isClient && (
          <div className="flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-gray-600">Atual:</span>
              <span className="font-semibold text-blue-600">
                {currentPressure.toFixed(1)} kPa
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-600">Média:</span>
              <span className="font-semibold text-gray-700">
                {avgPressure} kPa
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-600">Máx:</span>
              <span className="font-semibold text-red-600">
                {maxPressure} kPa
              </span>
            </div>
          </div>
        )}
      </div>

      {!selectedBlock ? (
        <div className="w-full h-[250px] flex flex-col items-center justify-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <svg className="w-16 h-16 text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <p className="text-gray-600 font-medium">Selecione um bloco para visualizar dados de pressão</p>
          <p className="text-sm text-gray-500 mt-1">Os dados serão exibidos em tempo real</p>
        </div>
      ) : !isClient ? (
        <div className="w-full h-[250px] flex items-center justify-center">
          <div className="text-gray-500">Carregando gráfico...</div>
        </div>
      ) : (
        <>

          
          <ResponsiveContainer width="100%" height={250}>
            <LineChart 
              data={pressureData} 
              margin={{ top: 5, right: 10, left: -20, bottom: 5 }}
            >
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke="#e5e7eb" 
                vertical={false}
              />
              <XAxis 
                dataKey="time" 
                stroke="#6b7280"
                style={{ fontSize: '11px' }}
                tickFormatter={(value) => `${Math.round(value)}s`}
                interval="preserveEnd"
                tick={{ fill: '#6b7280' }}
              />
              <YAxis 
                stroke="#6b7280"
                style={{ fontSize: '11px' }}
                domain={[0, 100]}
                ticks={[0, 25, 50, 75, 100]}
                tick={{ fill: '#6b7280' }}
                label={{ 
                  value: 'Pressão (kPa)', 
                  angle: -90, 
                  position: 'insideLeft',
                  style: { fontSize: '12px', fill: '#6b7280' }
                }}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  padding: '8px 12px'
                }}
                formatter={(value: number) => [`${value.toFixed(2)} kPa`, 'Pressão']}
                labelFormatter={(label) => `Tempo: ${parseFloat(label).toFixed(1)}s`}
              />
              <Line 
                type="monotone" 
                dataKey="pressure" 
                stroke="#3b82f6"
                strokeWidth={2}
                dot={false}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>

          <div className="mt-3 pt-3 border-t border-gray-200">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>Monitoramento contínuo via sensor piezoelétrico</span>
              <span>Atualização: 1Hz (1s)</span>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

