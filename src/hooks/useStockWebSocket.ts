import { useState, useEffect } from 'react';
import { WebSocketMessage, StockRealtime } from '@/types/websocket';
// /src/lib/korea-investment/client.ts

export const getWebSocketToken = async () => {
  // 실제 토큰 발급 로직 구현
  // 한국투자증권 API를 호출하여 웹소켓 토큰을 받아오는 로직
  return "your_websocket_token";
};

export const getWebSocketURL = () => {
  // 웹소켓 URL 반환
  return "wss://your.websocket.url";
};

export const createWebSocketMessage = (token: string, stockCode: string) => {
  return {
    cmd: "subscribe",
    token: token,
    stock: stockCode,
  };
};

export function useStockWebSocket(stockCode: string) {
  const [realtimeData, setRealtimeData] = useState<StockRealtime | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let ws: WebSocket | null = null;
    let reconnectTimeout: NodeJS.Timeout;
    let heartbeatInterval: NodeJS.Timeout;

    const connect = async () => {
      try {
        const token = await getWebSocketToken();
        const wsUrl = getWebSocketURL();
        
        console.log('Connecting to WebSocket...', wsUrl);
        ws = new WebSocket(wsUrl);

        ws.onopen = () => {
          setIsConnected(true);
          setError(null);
          console.log('WebSocket Connected');

          // 실시간 구독 요청
          const message = createWebSocketMessage(token, stockCode);
          console.log('Sending subscription message:', message);
          ws?.send(JSON.stringify(message));

          // Heartbeat 설정
          heartbeatInterval = setInterval(() => {
            if (ws?.readyState === WebSocket.OPEN) {
              ws.send(JSON.stringify({ cmd: 'PING' }));
            }
          }, 30000);
        };

        ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            console.log('Received WebSocket message:', data);

            if (data.cmd === 'PONG') return;
            
            if (data.error) {
              console.error('WebSocket message error:', data.error);
              return;
            }

            // 실시간 데이터 파싱
            if (data.type === 'stock' && data.data) {
              setRealtimeData({
                체결시간: data.data.time || '',
                현재가: parseFloat(data.data.price) || 0,
                전일대비: parseFloat(data.data.change) || 0,
                등락율: parseFloat(data.data.rate) || 0,
                거래량: parseInt(data.data.volume) || 0,
                거래대금: parseInt(data.data.amount) || 0,
              });
            }
          } catch (err) {
            console.error('Error parsing message:', err);
          }
        };

        ws.onerror = (event) => {
          console.error('WebSocket error occurred:', event);
          setError(new Error('WebSocket connection error'));
        };

        ws.onclose = (event) => {
          setIsConnected(false);
          console.log('WebSocket Disconnected:', event);
          clearInterval(heartbeatInterval);
          
          // 비정상 종료인 경우에만 재연결
          if (!event.wasClean) {
            reconnectTimeout = setTimeout(connect, 5000);
          }
        };

      } catch (err) {
        setError(err as Error);
        console.error('Error connecting to WebSocket:', err);
        reconnectTimeout = setTimeout(connect, 5000);
      }
    };

    connect();

    return () => {
      clearTimeout(reconnectTimeout);
      clearInterval(heartbeatInterval);
      if (ws) {
        ws.close(1000, 'Component unmounting');
        ws = null;
      }
    };
  }, [stockCode]);

  return { realtimeData, isConnected, error };
} 