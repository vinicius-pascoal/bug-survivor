import { StatType } from '../types/UpgradeTypes';

export interface UpgradeTreeNode {
  id: string;
  name: string;
  description: string;
  statType?: StatType;
  value: number;
  level: number; // Nível máximo que pode atingir
  currentLevel: number; // Nível atual
  cost: number; // Custo em pontos de upgrade
  prerequisites: string[]; // IDs de upgrades que devem ser concluídos primeiro
  column: number; // Coluna visual na árvore
  row: number; // Linha visual na árvore
}

export interface UpgradeTreeState {
  [key: string]: {
    currentLevel: number;
    unlocked: boolean;
    maxLevel: number;
  };
}

export class UpgradeTree {
  private nodes: Map<string, UpgradeTreeNode> = new Map();
  private state: UpgradeTreeState = {};
  private totalUpgradePoints: number = 0;
  private upgradeCurrency: number = 0; // Moeda de upgrade (não implementada ainda)

  constructor() {
    this.initializeTree();
  }

  private initializeTree() {
    // Tier 1 - Upgrades básicos
    this.addNode({
      id: 'health-boost-1',
      name: 'Reforço de Vida I',
      description: 'Aumenta vida máxima permanentemente',
      statType: StatType.MAX_HEALTH,
      value: 20,
      level: 1,
      currentLevel: 0,
      cost: 1,
      prerequisites: [],
      column: 0,
      row: 0,
    });

    this.addNode({
      id: 'speed-boost-1',
      name: 'Aumento de Velocidade I',
      description: 'Aumenta velocidade de movimento',
      statType: StatType.SPEED,
      value: 0.1,
      level: 1,
      currentLevel: 0,
      cost: 1,
      prerequisites: [],
      column: 1,
      row: 0,
    });

    this.addNode({
      id: 'damage-boost-1',
      name: 'Aumento de Dano I',
      description: 'Aumenta dano de todas as armas',
      statType: StatType.DAMAGE,
      value: 0.15,
      level: 1,
      currentLevel: 0,
      cost: 1,
      prerequisites: [],
      column: 2,
      row: 0,
    });

    this.addNode({
      id: 'attackspeed-boost-1',
      name: 'Ataque Rápido I',
      description: 'Aumenta velocidade de ataque',
      statType: StatType.ATTACK_SPEED,
      value: 0.1,
      level: 1,
      currentLevel: 0,
      cost: 1,
      prerequisites: [],
      column: 3,
      row: 0,
    });

    // Tier 2 - Upgrades especializados
    this.addNode({
      id: 'health-boost-2',
      name: 'Reforço de Vida II',
      description: 'Aumenta vida máxima ainda mais',
      statType: StatType.MAX_HEALTH,
      value: 30,
      level: 1,
      currentLevel: 0,
      cost: 2,
      prerequisites: ['health-boost-1'],
      column: 0,
      row: 1,
    });

    this.addNode({
      id: 'projectile-boost-1',
      name: 'Projétil Extra I',
      description: 'Adiciona um projétil às armas',
      statType: StatType.PROJECTILE_COUNT,
      value: 1,
      level: 1,
      currentLevel: 0,
      cost: 2,
      prerequisites: ['damage-boost-1'],
      column: 2,
      row: 1,
    });

    this.addNode({
      id: 'crit-boost-1',
      name: 'Golpe Crítico I',
      description: 'Aumenta chance de crítico',
      statType: StatType.CRIT_CHANCE,
      value: 0.05,
      level: 1,
      currentLevel: 0,
      cost: 2,
      prerequisites: ['attackspeed-boost-1'],
      column: 3,
      row: 1,
    });

    this.addNode({
      id: 'aoe-boost-1',
      name: 'Área de Efeito I',
      description: 'Aumenta o alcance das armas',
      statType: StatType.AREA_OF_EFFECT,
      value: 0.15,
      level: 1,
      currentLevel: 0,
      cost: 2,
      prerequisites: ['speed-boost-1'],
      column: 1,
      row: 1,
    });

    // Tier 3 - Upgrades avançados
    this.addNode({
      id: 'projectile-boost-2',
      name: 'Projétil Extra II',
      description: 'Adiciona mais um projétil',
      statType: StatType.PROJECTILE_COUNT,
      value: 1,
      level: 1,
      currentLevel: 0,
      cost: 3,
      prerequisites: ['projectile-boost-1'],
      column: 2,
      row: 2,
    });

    this.addNode({
      id: 'xp-boost-1',
      name: 'Ganho de XP I',
      description: 'Aumenta experiência ganha',
      statType: StatType.XP_GAIN,
      value: 0.2,
      level: 1,
      currentLevel: 0,
      cost: 3,
      prerequisites: ['health-boost-2', 'crit-boost-1'],
      column: 0,
      row: 2,
    });

    this.addNode({
      id: 'health-boost-3',
      name: 'Reforço de Vida III',
      description: 'Vida máxima superior',
      statType: StatType.MAX_HEALTH,
      value: 40,
      level: 1,
      currentLevel: 0,
      cost: 3,
      prerequisites: ['health-boost-2'],
      column: 0,
      row: 3,
    });
  }

  private addNode(node: UpgradeTreeNode) {
    this.nodes.set(node.id, node);
    this.state[node.id] = {
      currentLevel: 0,
      unlocked: node.prerequisites.length === 0,
      maxLevel: node.level,
    };
  }

  // Desbloqueia um upgrade se todos os pré-requisitos forem atendidos
  canUnlock(upgradeId: string): boolean {
    const node = this.nodes.get(upgradeId);
    if (!node) return false;
    if (this.state[upgradeId].currentLevel >= node.level) return false;

    // Verifica se todos os pré-requisitos estão completos
    return node.prerequisites.every((prereqId) => {
      const prereqState = this.state[prereqId];
      const prereqNode = this.nodes.get(prereqId);
      if (!prereqState || !prereqNode) return false;
      return prereqState.currentLevel >= prereqNode.level;
    });
  }

  // Aplica um upgrade
  applyUpgrade(upgradeId: string): boolean {
    const node = this.nodes.get(upgradeId);
    if (!node) return false;
    if (!this.canUnlock(upgradeId)) return false;
    if (this.state[upgradeId].currentLevel >= node.level) return false;

    this.state[upgradeId].currentLevel++;
    this.totalUpgradePoints++;

    // Desbloqueia novos upgrades que dependem deste
    this.nodes.forEach((otherNode) => {
      if (otherNode.prerequisites.includes(upgradeId)) {
        this.state[otherNode.id].unlocked = this.canUnlock(otherNode.id);
      }
    });

    return true;
  }

  // Obtém todos os upgrades que podem ser desbloqueados
  getAvailableUpgrades(): UpgradeTreeNode[] {
    return Array.from(this.nodes.values()).filter((node) => {
      const stateInfo = this.state[node.id];
      return (
        stateInfo.unlocked &&
        stateInfo.currentLevel < node.level &&
        this.canUnlock(node.id)
      );
    });
  }

  // Obtém todos os upgrades
  getAllUpgrades(): UpgradeTreeNode[] {
    return Array.from(this.nodes.values());
  }

  // Obtém o estado atual de um upgrade
  getUpgradeState(upgradeId: string) {
    return this.state[upgradeId];
  }

  // Salva o estado no local storage
  saveToLocalStorage() {
    const data = {
      state: this.state,
      totalUpgradePoints: this.totalUpgradePoints,
      timestamp: Date.now(),
    };
    localStorage.setItem('bug-survivor-upgrade-tree', JSON.stringify(data));
  }

  // Carrega o estado do local storage
  loadFromLocalStorage(): boolean {
    const data = localStorage.getItem('bug-survivor-upgrade-tree');
    if (!data) return false;

    try {
      const parsed = JSON.parse(data);
      this.state = parsed.state;
      this.totalUpgradePoints = parsed.totalUpgradePoints;
      return true;
    } catch {
      return false;
    }
  }

  // Limpa o progresso
  resetProgress() {
    this.state = {};
    this.totalUpgradePoints = 0;
    this.initializeTree();
    localStorage.removeItem('bug-survivor-upgrade-tree');
  }

  // Obtém o estado completo
  getFullState() {
    return {
      state: this.state,
      nodes: Array.from(this.nodes.values()),
      totalUpgradePoints: this.totalUpgradePoints,
    };
  }
}
