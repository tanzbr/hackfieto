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

interface WebSocketData {
  sensorId: string
  timestamps: string[]
  valores: number[]
  valoresNewtons: number[]
  totalLeituras: number
}

export function PressureSeismograph({ selectedBlock }: PressureSeismographProps) {
  const [isClient, setIsClient] = useState(false)
  const [pressureData, setPressureData] = useState<PressureDataPoint[]>([])
  const [connectionStatus, setConnectionStatus] = useState<'disconnected' | 'connecting' | 'connected' | 'error'>('disconnected')
  const wsRef = useRef<WebSocket | null>(null)
  const startTimeRef = useRef<number | null>(null)
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    setIsClient(true)
  }, [])

  // Função para converter valoresNewtons para kPa
  // 1 Newton = 0.001 kPa (aproximação para pressão em área)
  const newtonsToKPa = (newtons: number): number => {
    // Assumindo área de contato padrão, convertendo para kPa
    // Para simplificar, vamos usar os valores diretamente como kPa
    // ou fazer conversão se necessário: newtons / 1000
    return newtons / 10 // Ajuste conforme necessário
  }

  // Função para calcular tempo relativo em segundos desde o início da conexão
  const getRelativeTime = (timestamp: string): number => {
    if (!startTimeRef.current) {
      startTimeRef.current = new Date(timestamp).getTime()
      return 0
    }
    const currentTime = new Date(timestamp).getTime()
    return (currentTime - startTimeRef.current) / 1000 // Converter para segundos
  }

  // Processar dados recebidos do WebSocket
  const processWebSocketData = (data: WebSocketData) => {
    if (!data.timestamps || !data.valoresNewtons || data.timestamps.length === 0) {
      return
    }

    setPressureData(prevData => {
      // Criar novos pontos a partir dos dados recebidos
      const newPoints: PressureDataPoint[] = data.timestamps.map((timestamp, index) => {
        const relativeTime = getRelativeTime(timestamp)
        const pressure = newtonsToKPa(data.valoresNewtons[index])
        
        return {
          time: relativeTime,
          pressure: pressure,
          timestamp: timestamp
        }
      })

      // Combinar com dados anteriores, evitando duplicatas por timestamp
      const existingTimestamps = new Set(prevData.map(p => p.timestamp))
      const uniqueNewPoints = newPoints.filter(p => !existingTimestamps.has(p.timestamp))
      
      const combined = [...prevData, ...uniqueNewPoints]
      
      // Manter apenas os últimos 30 segundos de dados
      const now = startTimeRef.current ? (Date.now() - startTimeRef.current) / 1000 : 0
      const filtered = combined.filter(point => {
        return point.time >= (now - 30) // Últimos 30 segundos
      })

      // Ordenar por tempo para garantir ordem correta
      return filtered.sort((a, b) => a.time - b.time)
    })
  }

  // Gerenciar conexão WebSocket
  useEffect(() => {
    if (!selectedBlock) {
      // Fechar conexão se houver
      if (wsRef.current) {
        wsRef.current.close()
        wsRef.current = null
      }
      setPressureData([])
      setConnectionStatus('disconnected')
      startTimeRef.current = null
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current)
        reconnectTimeoutRef.current = null
      }
      return
    }

    // Determinar sensorId baseado no bloco selecionado
    // Por enquanto, usando o ID "1" como no exemplo, mas pode ser mapeado dinamicamente
    const sensorId = "1" // Pode ser mapeado para selectedBlock.id ou similar
    const wsUrl = `wss://aqualy.tanz.dev/ws/piezo/dados/${sensorId}`

    setConnectionStatus('connecting')

    const connectWebSocket = () => {
      try {
        const ws = new WebSocket(wsUrl)

        ws.onopen = () => {
          setConnectionStatus('connected')
          setPressureData([]) // Limpar dados anteriores ao conectar
          startTimeRef.current = null // Resetar tempo inicial (será definido no primeiro dado recebido)
          if (reconnectTimeoutRef.current) {
            clearTimeout(reconnectTimeoutRef.current)
            reconnectTimeoutRef.current = null
          }
        }

        ws.onmessage = (event) => {
          try {
            const data: WebSocketData = JSON.parse(event.data)
            processWebSocketData(data)
          } catch (error) {
            console.error('Erro ao processar dados do WebSocket:', error)
          }
        }

        ws.onerror = (error) => {
          console.error('Erro no WebSocket:', error)
          setConnectionStatus('error')
        }

        ws.onclose = () => {
          setConnectionStatus('disconnected')
          wsRef.current = null
          
          // Tentar reconectar após 3 segundos se ainda houver um bloco selecionado
          if (selectedBlock) {
            reconnectTimeoutRef.current = setTimeout(() => {
              connectWebSocket()
            }, 3000)
          }
        }

        wsRef.current = ws
      } catch (error) {
        console.error('Erro ao conectar WebSocket:', error)
        setConnectionStatus('error')
        
        // Tentar reconectar após 3 segundos
        if (selectedBlock) {
          reconnectTimeoutRef.current = setTimeout(() => {
            connectWebSocket()
          }, 3000)
        }
      }
    }

    connectWebSocket()

    return () => {
      if (wsRef.current) {
        wsRef.current.close()
        wsRef.current = null
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current)
        reconnectTimeoutRef.current = null
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
          {selectedBlock && isClient && (
            <div className="flex items-center gap-2">
              {connectionStatus === 'connected' && (
                <div className="flex items-center gap-2 px-3 py-1 bg-green-50 rounded-full">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-xs font-medium text-green-700">CONECTADO</span>
                </div>
              )}
              {connectionStatus === 'connecting' && (
                <div className="flex items-center gap-2 px-3 py-1 bg-yellow-50 rounded-full">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                  <span className="text-xs font-medium text-yellow-700">CONECTANDO...</span>
                </div>
              )}
              {connectionStatus === 'error' && (
                <div className="flex items-center gap-2 px-3 py-1 bg-red-50 rounded-full">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span className="text-xs font-medium text-red-700">ERRO DE CONEXÃO</span>
                </div>
              )}
            </div>
          )}
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
                tickFormatter={(value) => {
                  const seconds = Math.round(value)
                  if (seconds < 0) return `${seconds}s`
                  if (seconds < 60) return `${seconds}s`
                  const minutes = Math.floor(seconds / 60)
                  const secs = seconds % 60
                  return `${minutes}m ${secs}s`
                }}
                interval="preserveEnd"
                tick={false}
                axisLine={false}
              />
              <YAxis 
                stroke="#6b7280"
                style={{ fontSize: '11px' }}
                domain={['auto', 'auto']}
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
                labelFormatter={(label, payload) => {
                  if (payload && payload[0]?.payload?.timestamp) {
                    const date = new Date(payload[0].payload.timestamp)
                    return `Tempo: ${date.toLocaleTimeString('pt-BR')}`
                  }
                  return `Tempo: ${parseFloat(label).toFixed(1)}s`
                }}
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
              <div className="flex items-center gap-4">
                {connectionStatus === 'connected' && (
                  <span className="text-green-600">Recebendo dados do backend (1s)</span>
                )}
                {connectionStatus === 'connecting' && (
                  <span className="text-yellow-600">Conectando ao servidor...</span>
                )}
                {connectionStatus === 'error' && (
                  <span className="text-red-600">Tentando reconectar...</span>
                )}
                <span>Sensor ID: {selectedBlock ? '1' : '-'}</span>
                {pressureData.length > 0 && (
                  <span>Pontos: {pressureData.length}</span>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

