'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { UpgradeTree } from '@/game/upgrades/UpgradeTree';
import { UpgradeTreeNode } from '@/game/upgrades/UpgradeTree';
import { StatType } from '@/game/types/UpgradeTypes';

export default function UpgradesPage() {
  const [upgradeTree, setUpgradeTree] = useState<UpgradeTree | null>(null);
  const [availableUpgrades, setAvailableUpgrades] = useState<UpgradeTreeNode[]>([]);
  const [allUpgrades, setAllUpgrades] = useState<UpgradeTreeNode[]>([]);
  const [selectedUpgrade, setSelectedUpgrade] = useState<UpgradeTreeNode | null>(null);
  const [upgradeCounts, setUpgradeCounts] = useState<Record<string, { current: number; max: number }>>({});

  useEffect(() => {
    // Inicializa a árvore de upgrades
    const tree = new UpgradeTree();
    tree.loadFromLocalStorage();
    setUpgradeTree(tree);
    setAvailableUpgrades(tree.getAvailableUpgrades());
    setAllUpgrades(tree.getAllUpgrades());

    // Prepara contagem de upgrades
    const counts: Record<string, { current: number; max: number }> = {};
    tree.getAllUpgrades().forEach((node) => {
      const state = tree.getUpgradeState(node.id);
      if (state) {
        counts[node.id] = {
          current: state.currentLevel,
          max: node.level,
        };
      }
    });
    setUpgradeCounts(counts);
  }, []);

  const handleUpgradeClick = (upgrade: UpgradeTreeNode) => {
    if (!upgradeTree) return;

    if (upgradeTree.canUnlock(upgrade.id)) {
      upgradeTree.applyUpgrade(upgrade.id);
      upgradeTree.saveToLocalStorage();

      // Atualiza estados
      setAvailableUpgrades(upgradeTree.getAvailableUpgrades());

      const newCounts = { ...upgradeCounts };
      const state = upgradeTree.getUpgradeState(upgrade.id);
      newCounts[upgrade.id] = {
        current: state.currentLevel,
        max: upgrade.level,
      };
      setUpgradeCounts(newCounts);

      if (selectedUpgrade?.id === upgrade.id) {
        setSelectedUpgrade({ ...upgrade, currentLevel: state.currentLevel });
      }
    }
  };

  const handleReset = () => {
    if (window.confirm('Tem certeza que deseja resetar todos os upgrades?')) {
      if (upgradeTree) {
        upgradeTree.resetProgress();
        setUpgradeTree(new UpgradeTree());
        setAvailableUpgrades([]);
        setSelectedUpgrade(null);
        setUpgradeCounts({});
      }
    }
  };

  const getStatTypeLabel = (statType?: StatType): string => {
    const labels: Record<StatType, string> = {
      [StatType.MAX_HEALTH]: 'Vida Máxima',
      [StatType.SPEED]: 'Velocidade',
      [StatType.DAMAGE]: 'Dano',
      [StatType.ATTACK_SPEED]: 'Velocidade de Ataque',
      [StatType.CRIT_CHANCE]: 'Chance de Crítico',
      [StatType.AREA_OF_EFFECT]: 'Área de Efeito',
      [StatType.PROJECTILE_COUNT]: 'Contagem de Projéteis',
      [StatType.XP_GAIN]: 'Ganho de XP',
    };
    return statType ? labels[statType] : 'Desconhecido';
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/fundos home/origbig.png')",
          filter: 'brightness(0.7)',
        }}
      />

      {/* Grid Overlay */}
      <div className="absolute inset-0 opacity-20">
        <div className="h-full w-full" style={{
          backgroundImage: `
            linear-gradient(rgba(0, 255, 255, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 255, 255, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }} />
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen w-full p-4 sm:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-wider text-transparent bg-clip-text bg-linear-to-r from-cyan-400 via-purple-500 to-magenta-500 animate-pulse">
              ÁRVORE DE UPGRADES
            </h1>
            <Link href="/">
              <button className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded font-mono transition-all">
                &lt; VOLTAR
              </button>
            </Link>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Panel - Upgrades Grid */}
            <div className="lg:col-span-2">
              <div className="bg-black/60 border-2 border-cyan-400 rounded-lg p-6 backdrop-blur-sm">
                <h2 className="text-2xl font-bold text-cyan-400 mb-6 font-mono">
                  &gt; UPGRADES DISPONÍVEIS
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
                  {allUpgrades.map((upgrade) => {
                    const count = upgradeCounts[upgrade.id];
                    const isAvailable = upgradeTree?.canUnlock(upgrade.id) || false;
                    const isCompleted = count && count.current >= count.max;

                    return (
                      <button
                        key={upgrade.id}
                        onClick={() => {
                          handleUpgradeClick(upgrade);
                          setSelectedUpgrade(upgrade);
                        }}
                        disabled={!isAvailable || isCompleted}
                        className={`p-4 rounded border-2 transition-all font-mono text-left ${isCompleted
                          ? 'bg-green-900/30 border-green-500 opacity-75 cursor-default'
                          : isAvailable
                            ? 'bg-purple-900/50 border-purple-500 hover:border-cyan-400 hover:bg-purple-900/70 cursor-pointer'
                            : 'bg-gray-900/30 border-gray-600 opacity-50 cursor-not-allowed'
                          }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <h3 className={`font-bold ${isCompleted ? 'text-green-400' : isAvailable ? 'text-purple-300' : 'text-gray-400'}`}>
                              {upgrade.name}
                            </h3>
                            <p className={`text-sm ${isAvailable ? 'text-cyan-300' : 'text-gray-500'}`}>
                              {upgrade.description}
                            </p>
                            {upgrade.prerequisites.length > 0 && (
                              <p className="text-xs text-gray-400 mt-2">
                                Pré-req: {upgrade.prerequisites.join(', ')}
                              </p>
                            )}
                          </div>
                          <div className="text-right">
                            <p className={`text-sm font-bold ${isAvailable ? 'text-magenta-400' : 'text-gray-500'}`}>
                              {count?.current || 0}/{count?.max || 1}
                            </p>
                            {!isCompleted && (
                              <p className="text-xs text-yellow-400">
                                Custo: {upgrade.cost}
                              </p>
                            )}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right Panel - Info */}
            <div className="flex flex-col gap-4">
              {/* Info Card */}
              <div className="bg-black/60 border-2 border-magenta-400 rounded-lg p-6 backdrop-blur-sm">
                <h2 className="text-xl font-bold text-magenta-400 mb-4 font-mono">
                  &gt; INFORMAÇÕES
                </h2>

                {selectedUpgrade ? (
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-400">Nome</p>
                      <p className="text-lg font-bold text-cyan-300">{selectedUpgrade.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Descrição</p>
                      <p className="text-sm text-gray-300">{selectedUpgrade.description}</p>
                    </div>
                    {selectedUpgrade.statType && (
                      <div>
                        <p className="text-sm text-gray-400">Tipo de Stat</p>
                        <p className="text-sm text-purple-300">{getStatTypeLabel(selectedUpgrade.statType)}</p>
                      </div>
                    )}
                    <div>
                      <p className="text-sm text-gray-400">Valor</p>
                      <p className="text-sm text-green-400">+{selectedUpgrade.value}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Nível</p>
                      <p className="text-sm text-yellow-300">
                        {upgradeCounts[selectedUpgrade.id]?.current || 0}/{selectedUpgrade.level}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Custo</p>
                      <p className="text-sm text-magenta-300">{selectedUpgrade.cost} ponto(s)</p>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-400 font-mono text-sm">Selecione um upgrade para ver detalhes</p>
                )}
              </div>

              {/* Stats Card */}
              <div className="bg-black/60 border-2 border-emerald-400 rounded-lg p-6 backdrop-blur-sm">
                <h2 className="text-xl font-bold text-emerald-400 mb-4 font-mono">
                  &gt; ESTATÍSTICAS
                </h2>

                <div className="space-y-2 font-mono text-sm">
                  <p>
                    <span className="text-cyan-300">Upgrades Completos:</span>{' '}
                    <span className="text-magenta-300">
                      {allUpgrades.filter((u) => (upgradeCounts[u.id]?.current || 0) >= u.level).length}
                    </span>
                  </p>
                  <p>
                    <span className="text-cyan-300">Upgrades Disponíveis:</span>{' '}
                    <span className="text-purple-300">{availableUpgrades.length}</span>
                  </p>
                  <p>
                    <span className="text-cyan-300">Total de Upgrades:</span>{' '}
                    <span className="text-yellow-300">{allUpgrades.length}</span>
                  </p>
                  <p>
                    <span className="text-cyan-300">Pontos Usados:</span>{' '}
                    <span className="text-green-300">
                      {upgradeTree?.getFullState().totalUpgradePoints || 0}
                    </span>
                  </p>
                </div>
              </div>

              {/* Reset Button */}
              <button
                onClick={handleReset}
                className="w-full px-4 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded font-mono transition-all"
              >
                &gt; RESETAR UPGRADES
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Scanline Effect */}
      <div className="pointer-events-none absolute inset-0 opacity-10">
        <div className="h-full w-full animate-scan" style={{
          background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 255, 255, 0.2) 2px, rgba(0, 255, 255, 0.2) 4px)'
        }} />
      </div>
    </div>
  );
}
