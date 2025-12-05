import { useEffect, useState } from 'react';
import { OrderStatus } from '@/types';

interface ProgressTimerProps {
    status: OrderStatus;
    createdAt: Date;
}

export const useOrderProgress = ({ status, createdAt }: ProgressTimerProps) => {
    const [progress, setProgress] = useState(0);

    // Definir duração de cada etapa em milissegundos
    const getDuration = (status: OrderStatus): number => {
        switch (status) {
            case 'Pendente':
                return 60000; // 1 minuto
            case 'Em Preparo':
                return 240000; // 4 minutos
            case 'Pronto':
                return 360000; // 6 minutos
            case 'Em Entrega':
                return 1800000; // 30 minutos
            case 'Entregue':
                return 0; // Não tem progressão
            default:
                return 0;
        }
    };

    useEffect(() => {
        const duration = getDuration(status);

        if (duration === 0) {
            setProgress(100);
            return;
        }

        // Calcular o progresso inicial baseado no tempo decorrido
        const now = new Date().getTime();
        const start = new Date(createdAt).getTime();
        const elapsed = now - start;
        const initialProgress = Math.min((elapsed / duration) * 100, 100);

        setProgress(initialProgress);

        // Atualizar progresso a cada 500ms
        const interval = setInterval(() => {
            const currentTime = new Date().getTime();
            const elapsedTime = currentTime - start;
            const currentProgress = Math.min((elapsedTime / duration) * 100, 100);

            setProgress(currentProgress);

            // Parar quando atingir 100%
            if (currentProgress >= 100) {
                clearInterval(interval);
            }
        }, 500);

        return () => clearInterval(interval);
    }, [status, createdAt]);

    return progress;
};
