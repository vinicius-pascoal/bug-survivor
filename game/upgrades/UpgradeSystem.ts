import { Upgrade, UpgradeType, StatType, StatUpgrade, WeaponUpgrade } from '../types/UpgradeTypes';
import { WEAPONS_DATABASE } from '../data/WeaponsDatabase';
import { WeaponType } from '../types/WeaponTypes';

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

  setPlayerLevel(level: number) {
    this.playerLevel = level;
  }

  // Gera opções de upgrade baseado no nível do jogador
  generateUpgradeOptions(count: number = 3, hasWeaponSlot: boolean = true): Upgrade[] {
    const options: Upgrade[] = [];
    const typesUsed = new Set<string>();

    while (options.length < count) {
      const upgradeType = this.getRandomUpgradeType(hasWeaponSlot, typesUsed);
      let upgrade: Upgrade | null = null;

      switch (upgradeType) {
        case UpgradeType.WEAPON:
          upgrade = this.generateWeaponUpgrade();
          break;
        case UpgradeType.STAT:
          upgrade = this.generateStatUpgrade(typesUsed);
          break;
      }

      if (upgrade) {
        options.push(upgrade);
        if (upgrade.type === UpgradeType.STAT) {
          typesUsed.add((upgrade as StatUpgrade).statType);
        }
      }
    }

    return options;
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

  private getRandomUpgradeType(hasWeaponSlot: boolean, typesUsed: Set<string>): UpgradeType {
    // Se não tem slot de arma disponível, só oferece stat upgrades
    if (!hasWeaponSlot) {
      return UpgradeType.STAT;
    }

    // 40% chance de arma, 60% de stat
    const rand = Math.random();
    if (rand < 0.4) {
      return UpgradeType.WEAPON;
    }
    return UpgradeType.STAT;
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

  private generateStatUpgrade(usedStats: Set<string>): StatUpgrade {
    const availableStats = Object.values(StatType).filter(stat => !usedStats.has(stat));
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
}
