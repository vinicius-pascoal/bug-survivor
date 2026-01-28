import { Upgrade, UpgradeType, StatType, StatUpgrade, WeaponUpgrade, AreaPowerUpgrade } from '../types/UpgradeTypes';
import { WEAPONS_DATABASE } from '../data/WeaponsDatabase';
import { WeaponType } from '../types/WeaponTypes';
import { AreaEffectType } from '../types/AreaEffectTypes';

export class UpgradeSystem {
  private playerLevel: number = 1;

  // Armas base disponíveis para iniciar
  private readonly starterWeapons: WeaponType[] = [
    'wooden-sword',
    'bronze-sword',
    'bronze-saber',
    'blood-dagger',
  ];

  // Armas que podem aparecer como upgrade (baseado no nível)
  private readonly availableWeapons: WeaponType[] = [
    'wooden-sword',
    'bronze-sword',
    'bronze-saber',
    'blood-dagger',
    'blood-sword',
    'vampiric-sword',
    'carmesin-dagger',
    'gransword',
    'amber-greatsword',
    'flame-sword',
    'piercer',
    'butcher',
    'scale-sword',
  ];

  // Poderes de área disponíveis
  private readonly areaPowers: Array<{ id: string; name: string; description: string; damage: number; cooldown: number; minLevel: number }> = [
    { id: 'default', name: 'Explosão Padrão', description: 'Explosões básicas caem no mapa', damage: 35, cooldown: 5, minLevel: 1 },
    { id: 'lightning', name: 'Tempestade de Raios', description: 'Raios caem aleatoriamente', damage: 50, cooldown: 8, minLevel: 3 },
    { id: 'toxic', name: 'Gás Tóxico', description: 'Nuvem tóxica explode no mapa', damage: 40, cooldown: 6, minLevel: 2 },
    { id: 'electric', name: 'Explosão Elétrica', description: 'Descargas elétricas no mapa', damage: 55, cooldown: 7, minLevel: 4 },
    { id: 'fire', name: 'Chuva de Fogo', description: 'Explosões de fogo caem no mapa', damage: 45, cooldown: 7, minLevel: 4 },
    { id: 'atomic', name: 'Explosão Atômica', description: 'Explosões nucleares em área', damage: 80, cooldown: 12, minLevel: 6 },
    { id: 'water-fire', name: 'Inferno Aquático', description: 'Combinação de água e fogo no mapa', damage: 60, cooldown: 9, minLevel: 5 },
  ];

  setPlayerLevel(level: number) {
    console.log(`[UpgradeSystem] Nível do jogador atualizado para: ${level}`);
    this.playerLevel = level;
  }

  // Gera opções de upgrade baseado no nível do jogador
  generateUpgradeOptions(count: number = 3, hasWeaponSlot: boolean = true): Upgrade[] {
    const options: Upgrade[] = [];
    const usedStats = new Set<string>();

    // Gera exatamente 'count' upgrades
    for (let i = 0; i < count; i++) {
      let upgrade: Upgrade | null = null;
      let attempts = 0;
      const maxAttempts = 50;

      // Tenta gerar um upgrade válido
      while (!upgrade && attempts < maxAttempts) {
        attempts++;
        const upgradeType = this.selectUpgradeType(hasWeaponSlot, i);

        switch (upgradeType) {
          case UpgradeType.WEAPON:
            upgrade = this.generateWeaponUpgrade();
            break;

          case UpgradeType.STAT:
            upgrade = this.generateStatUpgrade(usedStats);
            // Se esgotou os stats, permite repetição
            if (!upgrade && usedStats.size > 0) {
              usedStats.clear();
              upgrade = this.generateStatUpgrade(usedStats);
            }
            break;

          case UpgradeType.AREA_POWER:
            upgrade = this.generateRandomAreaPowerUpgrade();
            // Se não conseguiu gerar poder, tenta stat como fallback
            if (!upgrade) {
              upgrade = this.generateStatUpgrade(usedStats);
              if (!upgrade && usedStats.size > 0) {
                usedStats.clear();
                upgrade = this.generateStatUpgrade(usedStats);
              }
            }
            break;
        }
      }

      // Se ainda não conseguiu, força um upgrade de vida
      if (!upgrade) {
        upgrade = {
          type: UpgradeType.STAT,
          statType: StatType.MAX_HEALTH,
          name: '+20 Vida Máxima',
          description: 'Aumenta sua vida máxima permanentemente',
          value: 20,
          iconPath: `/icons/stat-${StatType.MAX_HEALTH}.png`,
        };
      }

      options.push(upgrade);

      // Rastreia stats usados para evitar duplicatas
      if (upgrade.type === UpgradeType.STAT) {
        usedStats.add((upgrade as StatUpgrade).statType);
      }
    }

    console.log(`[UpgradeSystem] Geradas ${options.length} opções:`, options.map(o => `${o.type}: ${o.name}`));
    return options;
  }

  // Seleciona tipo de upgrade com base na posição e disponibilidade
  private selectUpgradeType(hasWeaponSlot: boolean, position: number): UpgradeType {
    const hasPowersAvailable = this.areaPowers.some(power => power.minLevel <= this.playerLevel);

    console.log(`[UpgradeSystem] Selecionando tipo para posição ${position}. Nível: ${this.playerLevel}, Poderes disponíveis: ${hasPowersAvailable}, Slot arma: ${hasWeaponSlot}`);

    // Primeira opção: tenta garantir diversidade
    if (position === 0) {
      // 40% stat, 30% arma (se disponível), 30% poder (se disponível)
      const rand = Math.random();
      if (rand < 0.4) {
        console.log('[UpgradeSystem] Tipo selecionado: STAT');
        return UpgradeType.STAT;
      } else if (rand < 0.7 && hasWeaponSlot) {
        console.log('[UpgradeSystem] Tipo selecionado: WEAPON');
        return UpgradeType.WEAPON;
      } else if (hasPowersAvailable) {
        console.log('[UpgradeSystem] Tipo selecionado: AREA_POWER');
        return UpgradeType.AREA_POWER;
      }
      console.log('[UpgradeSystem] Tipo selecionado (fallback): STAT');
      return UpgradeType.STAT;
    }

    // Segunda e terceira opções: mais aleatório
    const result = this.getRandomUpgradeType(hasWeaponSlot);
    console.log(`[UpgradeSystem] Tipo selecionado: ${result}`);
    return result;
  }

  // Gera opções de armas iniciais
  generateStarterWeaponOptions(): WeaponUpgrade[] {
    return this.starterWeapons.map(weaponId => {
      const weaponData = WEAPONS_DATABASE[weaponId];
      return {
        type: UpgradeType.WEAPON,
        weaponData,
        name: weaponData.name,
        description: weaponData.description,
        iconPath: weaponData.imagePath,
      };
    });
  }

  private getRandomUpgradeType(hasWeaponSlot: boolean): UpgradeType {
    // Verifica se há poderes de área disponíveis para o nível
    const hasPowersAvailable = this.areaPowers.some(power => power.minLevel <= this.playerLevel);

    if (!hasWeaponSlot) {
      // Sem slot de arma: 60% stat, 40% area power
      if (hasPowersAvailable) {
        const rand = Math.random();
        return rand < 0.6 ? UpgradeType.STAT : UpgradeType.AREA_POWER;
      }
      return UpgradeType.STAT;
    }

    if (hasPowersAvailable) {
      // Com arma e poderes: 35% arma, 35% stat, 30% poder de área
      const rand = Math.random();
      if (rand < 0.35) {
        return UpgradeType.WEAPON;
      } else if (rand < 0.7) {
        return UpgradeType.STAT;
      }
      return UpgradeType.AREA_POWER;
    } else {
      // Com arma mas sem poderes: 40% arma, 60% stat
      const rand = Math.random();
      return rand < 0.4 ? UpgradeType.WEAPON : UpgradeType.STAT;
    }
  }

  private generateWeaponUpgrade(): WeaponUpgrade | null {
    // Filtra armas baseado no nível do jogador
    const eligibleWeapons = this.availableWeapons.filter(weaponId => {
      const weapon = WEAPONS_DATABASE[weaponId];
      return weapon.levelRequirement <= this.playerLevel;
    });

    if (eligibleWeapons.length === 0) return null;

    const randomWeaponId = eligibleWeapons[Math.floor(Math.random() * eligibleWeapons.length)];
    const weaponData = WEAPONS_DATABASE[randomWeaponId];

    return {
      type: UpgradeType.WEAPON,
      weaponData,
      name: weaponData.name,
      description: weaponData.description,
      iconPath: weaponData.imagePath,
    };
  }

  private generateStatUpgrade(usedStats: Set<string>): StatUpgrade | null {
    const availableStats = Object.values(StatType).filter(stat => !usedStats.has(stat));

    // Se não há stats disponíveis, retorna null
    if (availableStats.length === 0) {
      return null;
    }

    const statType = availableStats[Math.floor(Math.random() * availableStats.length)];

    const statConfigs: Record<StatType, { name: string; description: string; value: number }> = {
      [StatType.MAX_HEALTH]: {
        name: '+20 Vida Máxima',
        description: 'Aumenta sua vida máxima permanentemente',
        value: 20,
      },
      [StatType.SPEED]: {
        name: '+10% Velocidade',
        description: 'Aumenta a velocidade de movimento',
        value: 0.1,
      },
      [StatType.DAMAGE]: {
        name: '+15% Dano',
        description: 'Aumenta o dano de todas as armas',
        value: 0.15,
      },
      [StatType.ATTACK_SPEED]: {
        name: '+10% Velocidade de Ataque',
        description: 'Reduz o tempo entre ataques',
        value: 0.1,
      },
      [StatType.CRIT_CHANCE]: {
        name: '+5% Chance de Crítico',
        description: 'Aumenta a chance de acerto crítico',
        value: 0.05,
      },
      [StatType.AREA_OF_EFFECT]: {
        name: '+15% Área de Efeito',
        description: 'Aumenta o alcance das armas',
        value: 0.15,
      },
      [StatType.PROJECTILE_COUNT]: {
        name: '+1 Projétil',
        description: 'Adiciona um projétil adicional às armas de projétil',
        value: 1,
      },
      [StatType.XP_GAIN]: {
        name: '+20% Ganho de XP',
        description: 'Aumenta a experiência ganha',
        value: 0.2,
      },
    };

    const config = statConfigs[statType];

    return {
      type: UpgradeType.STAT,
      statType,
      name: config.name,
      description: config.description,
      value: config.value,
      iconPath: `/icons/stat-${statType}.png`,
    };
  }

  // Gera upgrade de poder de área aleatório disponível para o nível
  private generateRandomAreaPowerUpgrade(): AreaPowerUpgrade | null {
    const eligiblePowers = this.areaPowers.filter(power => power.minLevel <= this.playerLevel);

    console.log(`[UpgradeSystem] Gerando poder de área. Nível: ${this.playerLevel}, Poderes disponíveis:`, eligiblePowers.length);

    if (eligiblePowers.length === 0) {
      console.log('[UpgradeSystem] Nenhum poder de área disponível para este nível');
      return null;
    }

    const randomPower = eligiblePowers[Math.floor(Math.random() * eligiblePowers.length)];

    console.log(`[UpgradeSystem] Poder de área selecionado: ${randomPower.name} (${randomPower.id})`);

    return {
      type: UpgradeType.AREA_POWER,
      powerType: randomPower.id as AreaEffectType,
      name: randomPower.name,
      description: randomPower.description,
      baseDamage: randomPower.damage,
      cooldown: randomPower.cooldown,
      iconPath: `/icons/power-${randomPower.id}.png`,
    };
  }

  // Gera upgrade de poder de área específico
  generateAreaPowerUpgrade(powerType: string): AreaPowerUpgrade | null {
    const power = this.areaPowers.find(p => p.id === powerType);
    if (!power) return null;

    return {
      type: UpgradeType.AREA_POWER,
      powerType: power.id as AreaEffectType,
      name: power.name,
      description: power.description,
      baseDamage: power.damage,
      cooldown: power.cooldown,
      iconPath: `/icons/power-${power.id}.png`,
    };
  }
}
