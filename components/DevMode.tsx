import React, { useState } from 'react';

export interface DevModeProps {
  isGamePaused: boolean;
  onLevelUp: () => void;
  onSpawnBoss: () => void;
  onHealPlayer: () => void;
  onAddMaxHealth: () => void;
}

export const DevMode: React.FC<DevModeProps> = ({
  isGamePaused,
  onLevelUp,
  onSpawnBoss,
  onHealPlayer,
  onAddMaxHealth,
}) => {
  const [isDevModeEnabled, setIsDevModeEnabled] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  // Ativar dev mode com Ctrl+D
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 'd') {
        e.preventDefault();
        setIsDevModeEnabled(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Se não está ativado, retorna uma área hover invisível
  if (!isDevModeEnabled) {
    return (
      <div
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        className="absolute top-0 left-0 w-32 h-16 z-50"
        title="Passe o mouse para ativar Dev Mode (Ctrl+D)"
      >
        {isHovering && (
          <div className="absolute top-2 left-2 text-xs text-gray-500 bg-gray-900 bg-opacity-75 px-2 py-1 rounded border border-gray-700">
            DEV
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="absolute top-4 left-4 z-50 bg-gray-900 border-2 border-yellow-500 rounded-lg p-4 max-w-xs">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-yellow-400 font-bold text-sm">DEV MODE</h3>
        <button
          onClick={() => setIsDevModeEnabled(false)}
          className="text-yellow-400 hover:text-yellow-300 font-bold"
        >
          ✕
        </button>
      </div>

      <div className="space-y-2 text-xs">
        <button
          onClick={onLevelUp}
          disabled={!isGamePaused}
          className={`w-full px-3 py-2 rounded transition ${isGamePaused
            ? 'bg-green-700 hover:bg-green-600 text-green-100 cursor-pointer'
            : 'bg-gray-700 text-gray-500 cursor-not-allowed'
            }`}
        >
          ⬆️ Subir Nível
        </button>

        <button
          onClick={onSpawnBoss}
          disabled={!isGamePaused}
          className={`w-full px-3 py-2 rounded transition ${isGamePaused
            ? 'bg-red-700 hover:bg-red-600 text-red-100 cursor-pointer'
            : 'bg-gray-700 text-gray-500 cursor-not-allowed'
            }`}
        >
          👹 Invocar Boss
        </button>

        <button
          onClick={onHealPlayer}
          disabled={!isGamePaused}
          className={`w-full px-3 py-2 rounded transition ${isGamePaused
            ? 'bg-blue-700 hover:bg-blue-600 text-blue-100 cursor-pointer'
            : 'bg-gray-700 text-gray-500 cursor-not-allowed'
            }`}
        >
          ❤️ Curar Jogador
        </button>

        <button
          onClick={onAddMaxHealth}
          disabled={!isGamePaused}
          className={`w-full px-3 py-2 rounded transition ${isGamePaused
            ? 'bg-purple-700 hover:bg-purple-600 text-purple-100 cursor-pointer'
            : 'bg-gray-700 text-gray-500 cursor-not-allowed'
            }`}
        >
          💪 +100 Max HP
        </button>

        <div className="text-gray-400 mt-3 pt-3 border-t border-gray-700">
          {isGamePaused ? (
            <p className="text-yellow-300">⏸️ Jogo pausado - Opções disponíveis</p>
          ) : (
            <p className="text-gray-500">▶️ Play para usar opções</p>
          )}
          <p className="text-gray-500 text-xs mt-1">Ctrl+D: Fechar</p>
        </div>
      </div>
    </div>
  );
};
