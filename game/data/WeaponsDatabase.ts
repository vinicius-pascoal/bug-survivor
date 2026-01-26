import { WeaponData, WeaponType, WeaponRarity, WeaponCategory } from '../types/WeaponTypes';

// Base de dados de todas as armas do jogo
export const WEAPONS_DATABASE: Record<WeaponType, WeaponData> = {
  'wooden-sword': {
    id: 'wooden-sword',
    name: 'Espada de Madeira',
    category: WeaponCategory.SWORD,
    rarity: WeaponRarity.COMMON,
    imagePath: '/weapons/wooden-sword.png',
    description: 'Uma simples espada de treinamento',
    stats: {
      damage: 8,
      attackSpeed: 1.2,
      range: 50,
      critChance: 0.05,
      critMultiplier: 1.5,
    },
    ability: {
      name: 'Aprendizado Rápido',
      description: 'Concede +15% de XP para todas as ações',
      effect: 'xp_bonus_15',
    },
    levelRequirement: 1,
  },

  'bronze-sword': {
    id: 'bronze-sword',
    name: 'Espada de Bronze',
    category: WeaponCategory.SWORD,
    rarity: WeaponRarity.COMMON,
    imagePath: '/weapons/bronze-sword.png',
    description: 'Uma espada básica de metal',
    stats: {
      damage: 15,
      attackSpeed: 1.0,
      range: 55,
      critChance: 0.10,
      critMultiplier: 2.0,
    },
    ability: {
      name: 'Golpe Certeiro',
      description: 'Chance de 10% de causar dano crítico (2x dano)',
      effect: 'crit_chance_10',
    },
    levelRequirement: 3,
  },

  'bronze-saber': {
    id: 'bronze-saber',
    name: 'Sabre de Bronze',
    category: WeaponCategory.SWORD,
    rarity: WeaponRarity.COMMON,
    imagePath: '/weapons/bronze-saber.png',
    description: 'Sabre leve e veloz',
    stats: {
      damage: 12,
      attackSpeed: 1.5,
      range: 60,
      critChance: 0.08,
      critMultiplier: 1.8,
    },
    ability: {
      name: 'Corte Veloz',
      description: 'Taxa de ataque 25% mais rápida que espadas normais',
      effect: 'attack_speed_25',
    },
    levelRequirement: 3,
  },

  'blood-dagger': {
    id: 'blood-dagger',
    name: 'Adaga de Sangue',
    category: WeaponCategory.DAGGER,
    rarity: WeaponRarity.UNCOMMON,
    imagePath: '/weapons/blood-dagger.png',
    description: 'Adaga que se alimenta do sangue dos inimigos',
    stats: {
      damage: 10,
      attackSpeed: 2.0,
      range: 35,
      critChance: 0.15,
      critMultiplier: 1.6,
    },
    ability: {
      name: 'Sede de Sangue',
      description: 'Rouba 10% do dano causado como HP',
      effect: 'lifesteal_10',
    },
    levelRequirement: 5,
  },

  'blood-sword': {
    id: 'blood-sword',
    name: 'Espada de Sangue',
    category: WeaponCategory.SWORD,
    rarity: WeaponRarity.UNCOMMON,
    imagePath: '/weapons/blood-sword.png',
    description: 'Espada forjada com sangue de inimigos',
    stats: {
      damage: 18,
      attackSpeed: 1.1,
      range: 55,
      critChance: 0.12,
      critMultiplier: 2.0,
    },
    ability: {
      name: 'Pacto Sangrento',
      description: 'Cada inimigo morto aumenta o dano em 1% (máx 50%). Drena 5% do dano como HP',
      effect: 'damage_stack_lifesteal',
    },
    levelRequirement: 7,
  },

  'vampiric-sword': {
    id: 'vampiric-sword',
    name: 'Espada Vampírica',
    category: WeaponCategory.SWORD,
    rarity: WeaponRarity.RARE,
    imagePath: '/weapons/vampiric-sword.png',
    description: 'Espada amaldiçoada que drena a vida',
    stats: {
      damage: 25,
      attackSpeed: 1.0,
      range: 60,
      critChance: 0.15,
      critMultiplier: 2.2,
    },
    ability: {
      name: 'Fome Eterna',
      description: 'Rouba 20% do dano como HP. Quanto mais baixo seu HP, maior o dano (até +100%)',
      effect: 'lifesteal_20_low_hp_bonus',
    },
    levelRequirement: 12,
  },

  'dual-carmesim': {
    id: 'dual-carmesim',
    name: 'Adagas Carmesim Gêmeas',
    category: WeaponCategory.DAGGER,
    rarity: WeaponRarity.RARE,
    imagePath: '/weapons/dual-carmesim.png',
    description: 'Par de adagas que dançam em sincronia',
    stats: {
      damage: 16,
      attackSpeed: 2.2,
      range: 40,
      critChance: 0.18,
      critMultiplier: 1.8,
      projectileCount: 2,
    },
    ability: {
      name: 'Dança Carmesim',
      description: 'Ataca em padrão circular. Acumula sangue até ativar frenesi (2x velocidade por 5s)',
      effect: 'circular_attack_frenzy',
      cooldown: 15,
      duration: 5,
    },
    levelRequirement: 10,
  },

  'carmesin-dagger': {
    id: 'carmesin-dagger',
    name: 'Adaga Carmesim',
    category: WeaponCategory.DAGGER,
    rarity: WeaponRarity.UNCOMMON,
    imagePath: '/weapons/carmesin-dagger.png',
    description: 'Adaga rápida que causa sangramento',
    stats: {
      damage: 12,
      attackSpeed: 1.8,
      range: 38,
      critChance: 0.14,
      critMultiplier: 1.7,
    },
    ability: {
      name: 'Corte Sangrento',
      description: 'Aplica sangramento (DoT). Empilha até 5x',
      effect: 'bleed_stacks',
    },
    levelRequirement: 6,
  },

  'gransword': {
    id: 'gransword',
    name: 'Grande Espada',
    category: WeaponCategory.GREATSWORD,
    rarity: WeaponRarity.UNCOMMON,
    imagePath: '/weapons/gransword.png',
    description: 'Espadão pesado e devastador',
    stats: {
      damage: 35,
      attackSpeed: 0.6,
      range: 80,
      critChance: 0.10,
      critMultiplier: 2.5,
      areaOfEffect: 60,
    },
    ability: {
      name: 'Golpe Esmagador',
      description: 'Empurra inimigos para trás e atinge múltiplos alvos',
      effect: 'knockback_cleave',
    },
    levelRequirement: 8,
  },

  'amber-greatsword': {
    id: 'amber-greatsword',
    name: 'Espadão Âmbar',
    category: WeaponCategory.GREATSWORD,
    rarity: WeaponRarity.RARE,
    imagePath: '/weapons/amber-greatsword.png',
    description: 'Espadão fossilizado em âmbar',
    stats: {
      damage: 40,
      attackSpeed: 0.7,
      range: 85,
      critChance: 0.12,
      critMultiplier: 2.3,
      areaOfEffect: 70,
    },
    ability: {
      name: 'Preservação Âmbar',
      description: 'Inimigos mortos têm 15% de chance de soltar mais XP',
      effect: 'xp_drop_bonus',
    },
    levelRequirement: 12,
  },

  'ametist-greatsword': {
    id: 'ametist-greatsword',
    name: 'Espadão Ametista',
    category: WeaponCategory.GREATSWORD,
    rarity: WeaponRarity.RARE,
    imagePath: '/weapons/ametist-greatsword.png',
    description: 'Espadão místico de cristal roxo',
    stats: {
      damage: 38,
      attackSpeed: 0.65,
      range: 90,
      critChance: 0.13,
      critMultiplier: 2.4,
      areaOfEffect: 75,
    },
    ability: {
      name: 'Ressonância Ametista',
      description: 'Libera ondas de choque a cada 5º ataque',
      effect: 'shockwave_every_5',
    },
    levelRequirement: 13,
  },

  'diamond-greatsword': {
    id: 'diamond-greatsword',
    name: 'Espadão Diamante',
    category: WeaponCategory.GREATSWORD,
    rarity: WeaponRarity.EPIC,
    imagePath: '/weapons/diamond-greatsword.png',
    description: 'Espadão supremo forjado em diamante',
    stats: {
      damage: 50,
      attackSpeed: 0.55,
      range: 95,
      critChance: 0.20,
      critMultiplier: 3.0,
      areaOfEffect: 80,
    },
    ability: {
      name: 'Corte Diamante',
      description: 'Ignora 30% da defesa. Críticos causam estilhaços em área',
      effect: 'armor_pen_30_crit_shards',
    },
    levelRequirement: 18,
  },

  'hammersword': {
    id: 'hammersword',
    name: 'Espada-Martelo',
    category: WeaponCategory.GREATSWORD,
    rarity: WeaponRarity.RARE,
    imagePath: '/weapons/hammersword.png',
    description: 'Híbrido brutal de espada e martelo',
    stats: {
      damage: 45,
      attackSpeed: 0.6,
      range: 75,
      critChance: 0.10,
      critMultiplier: 2.8,
      areaOfEffect: 65,
    },
    ability: {
      name: 'Impacto Sísmico',
      description: 'Cria ondas de choque. Atordoa inimigos pequenos',
      effect: 'stun_shockwave',
    },
    levelRequirement: 14,
  },

  'flame-sword': {
    id: 'flame-sword',
    name: 'Espada Flamejante',
    category: WeaponCategory.SWORD,
    rarity: WeaponRarity.RARE,
    imagePath: '/weapons/flame-sword.png',
    description: 'Espada envolta em chamas eternas',
    stats: {
      damage: 22,
      attackSpeed: 1.1,
      range: 55,
      critChance: 0.15,
      critMultiplier: 2.0,
      areaOfEffect: 40,
    },
    ability: {
      name: 'Chamas Dançantes',
      description: 'Deixa rastro de fogo. Inimigos queimados recebem DoT',
      effect: 'fire_trail_burn',
    },
    levelRequirement: 11,
  },

  'sunbringer': {
    id: 'sunbringer',
    name: 'Portadora do Sol',
    category: WeaponCategory.SWORD,
    rarity: WeaponRarity.EPIC,
    imagePath: '/weapons/sunbringer.png',
    description: 'Espada sagrada que irradia luz solar',
    stats: {
      damage: 30,
      attackSpeed: 1.0,
      range: 60,
      critChance: 0.18,
      critMultiplier: 2.5,
      areaOfEffect: 100,
    },
    ability: {
      name: 'Explosão Solar',
      description: 'A cada 10 ataques, libera explosão de luz massiva',
      effect: 'solar_explosion_10',
    },
    levelRequirement: 16,
  },

  'diamond-piercer': {
    id: 'diamond-piercer',
    name: 'Perfurador Diamante',
    category: WeaponCategory.SPEAR,
    rarity: WeaponRarity.EPIC,
    imagePath: '/weapons/diamond-piercer.png',
    description: 'Estoque de cristal perfurante',
    stats: {
      damage: 28,
      attackSpeed: 1.3,
      range: 100,
      critChance: 0.22,
      critMultiplier: 2.2,
      piercing: 5,
    },
    ability: {
      name: 'Perfuração Precisa',
      description: 'Atravessa inimigos. Dano aumenta 25% por inimigo perfurado',
      effect: 'pierce_damage_ramp',
    },
    levelRequirement: 15,
  },

  'diamond-shadder': {
    id: 'diamond-shadder',
    name: 'Estilhaçador Diamante',
    category: WeaponCategory.SPECIAL,
    rarity: WeaponRarity.EPIC,
    imagePath: '/weapons/diamond-shadder.png',
    description: 'Mangual que gera estilhaços mortais',
    stats: {
      damage: 32,
      attackSpeed: 0.9,
      range: 70,
      critChance: 0.16,
      critMultiplier: 2.4,
      projectileCount: 6,
    },
    ability: {
      name: 'Chuva de Estilhaços',
      description: 'Cria estilhaços que voam em direções aleatórias (40% do dano base)',
      effect: 'shrapnel_burst',
    },
    levelRequirement: 17,
  },

  'diamond': {
    id: 'diamond',
    name: 'Diamante Puro',
    category: WeaponCategory.SPECIAL,
    rarity: WeaponRarity.LEGENDARY,
    imagePath: '/weapons/diamond.png',
    description: 'Cristal de puro poder',
    stats: {
      damage: 35,
      attackSpeed: 1.5,
      range: 90,
      critChance: 0.25,
      critMultiplier: 2.5,
    },
    ability: {
      name: 'Prisma Giratório',
      description: 'Orbita automaticamente. Reflete projéteis. Emite laser a cada órbita completa',
      effect: 'auto_orbit_reflect_laser',
    },
    levelRequirement: 20,
  },

  'scale-sword': {
    id: 'scale-sword',
    name: 'Espada Escamosa',
    category: WeaponCategory.SWORD,
    rarity: WeaponRarity.RARE,
    imagePath: '/weapons/scale-sword.png',
    description: 'Espada coberta com escamas de dragão',
    stats: {
      damage: 26,
      attackSpeed: 1.0,
      range: 58,
      critChance: 0.14,
      critMultiplier: 2.1,
    },
    ability: {
      name: 'Escamas Protetoras',
      description: 'Ganha escamas por ataque (máx 5). Com 5 escamas: 3x dano e -25% dano recebido',
      effect: 'scale_stack_damage_defense',
    },
    levelRequirement: 13,
  },

  'piercer': {
    id: 'piercer',
    name: 'Perfurador',
    category: WeaponCategory.SPEAR,
    rarity: WeaponRarity.UNCOMMON,
    imagePath: '/weapons/piercer.png',
    description: 'Lança rápida e precisa',
    stats: {
      damage: 20,
      attackSpeed: 1.4,
      range: 85,
      critChance: 0.12,
      critMultiplier: 2.0,
      piercing: 3,
    },
    ability: {
      name: 'Estocada Furiosa',
      description: 'Série de estocadas rápidas. Ignora primeira camada de defesa',
      effect: 'multi_thrust_armor_pen',
    },
    levelRequirement: 7,
  },

  'butcher': {
    id: 'butcher',
    name: 'Açougueiro',
    category: WeaponCategory.AXE,
    rarity: WeaponRarity.RARE,
    imagePath: '/weapons/butcher.png',
    description: 'Machado brutal de carnificina',
    stats: {
      damage: 42,
      attackSpeed: 0.7,
      range: 65,
      critChance: 0.15,
      critMultiplier: 2.5,
      areaOfEffect: 55,
    },
    ability: {
      name: 'Carnificina',
      description: 'Cada morte aumenta permanentemente o dano (nesta run). Causa sangramento massivo',
      effect: 'permanent_damage_stack_bleed',
    },
    levelRequirement: 10,
  },

  'ametist-butcher': {
    id: 'ametist-butcher',
    name: 'Açougueiro Ametista',
    category: WeaponCategory.AXE,
    rarity: WeaponRarity.EPIC,
    imagePath: '/weapons/ametist-butcher.png',
    description: 'Machado místico coletor de almas',
    stats: {
      damage: 48,
      attackSpeed: 0.75,
      range: 68,
      critChance: 0.18,
      critMultiplier: 2.6,
      areaOfEffect: 60,
    },
    ability: {
      name: 'Colheita de Almas',
      description: 'Inimigos soltam orbes de alma. Cada orbe +10% todos atributos (empilha 5x)',
      effect: 'soul_orbs_buff',
      duration: 10,
    },
    levelRequirement: 16,
  },

  'mordecostas': {
    id: 'mordecostas',
    name: 'Quebra-Costas',
    category: WeaponCategory.AXE,
    rarity: WeaponRarity.RARE,
    imagePath: '/weapons/mordecostas.png',
    description: 'Machado pesado que quebra ossos',
    stats: {
      damage: 50,
      attackSpeed: 0.6,
      range: 70,
      critChance: 0.12,
      critMultiplier: 2.8,
      areaOfEffect: 58,
    },
    ability: {
      name: 'Impacto Vertebral',
      description: '25% chance de aplicar "Coluna Quebrada" (lento). Dano extra vs lentos',
      effect: 'slow_bonus_damage',
    },
    levelRequirement: 14,
  },

  'scarllet': {
    id: 'scarllet',
    name: 'Escarlate',
    category: WeaponCategory.SPECIAL,
    rarity: WeaponRarity.EPIC,
    imagePath: '/weapons/scarllet.png',
    description: 'Lâmina dupla giratória',
    stats: {
      damage: 24,
      attackSpeed: 2.0,
      range: 75,
      critChance: 0.16,
      critMultiplier: 2.0,
      areaOfEffect: 150,
    },
    ability: {
      name: 'Vendaval Escarlate',
      description: 'Gira ao redor do jogador. Velocidade e dano crescentes',
      effect: 'spinning_ramp_up',
    },
    levelRequirement: 15,
  },

  'old-peace': {
    id: 'old-peace',
    name: 'Velha Paz',
    category: WeaponCategory.SWORD,
    rarity: WeaponRarity.LEGENDARY,
    imagePath: '/weapons/old-peace.png',
    description: 'Espada ancestral de tempos esquecidos',
    stats: {
      damage: 40,
      attackSpeed: 1.2,
      range: 65,
      critChance: 0.20,
      critMultiplier: 2.5,
    },
    ability: {
      name: 'Memórias de Tempos Pacíficos',
      description: 'Quanto menos inimigos ao redor, maior o dano. Em 1v1: 3x dano',
      effect: 'inverse_crowd_damage',
    },
    levelRequirement: 18,
  },

  'old-hero': {
    id: 'old-hero',
    name: 'Velho Herói',
    category: WeaponCategory.SWORD,
    rarity: WeaponRarity.LEGENDARY,
    imagePath: '/weapons/old-hero.png',
    description: 'Espada desgastada de um herói esquecido',
    stats: {
      damage: 35,
      attackSpeed: 1.1,
      range: 62,
      critChance: 1.0, // sempre crítico em inimigos conhecidos
      critMultiplier: 2.2,
    },
    ability: {
      name: 'Experiência de Batalha',
      description: 'Ganha bônus com tempo. Crítico garantido em inimigos já derrotados',
      effect: 'time_bonus_known_enemy_crit',
    },
    levelRequirement: 17,
  },

  'broken-hero': {
    id: 'broken-hero',
    name: 'Herói Quebrado',
    category: WeaponCategory.SWORD,
    rarity: WeaponRarity.LEGENDARY,
    imagePath: '/weapons/broken-hero.png',
    description: 'Espada despedaçada por incontáveis batalhas',
    stats: {
      damage: 30,
      attackSpeed: 1.3,
      range: 60,
      critChance: 0.25,
      critMultiplier: 3.0,
      projectileCount: 4,
    },
    ability: {
      name: 'Glória Despedaçada',
      description: 'Quanto mais dano tomar, maior seu ataque. <25% HP: +200% dano. Fragmentos atacam',
      effect: 'low_hp_massive_damage_shards',
    },
    levelRequirement: 20,
  },

  'greathero': {
    id: 'greathero',
    name: 'Grande Herói',
    category: WeaponCategory.GREATSWORD,
    rarity: WeaponRarity.LEGENDARY,
    imagePath: '/weapons/greathero.png',
    description: 'Espadão de um herói lendário',
    stats: {
      damage: 55,
      attackSpeed: 0.8,
      range: 100,
      critChance: 0.22,
      critMultiplier: 2.8,
      areaOfEffect: 120,
    },
    ability: {
      name: 'Presença Heroica',
      description: 'Aliados +20% dano. Inimigos -15% velocidade. Combo 10: área de buff',
      effect: 'aura_ally_buff_enemy_debuff',
    },
    levelRequirement: 22,
  },

  'rebuild-hope': {
    id: 'rebuild-hope',
    name: 'Esperança Reconstruída',
    category: WeaponCategory.SWORD,
    rarity: WeaponRarity.LEGENDARY,
    imagePath: '/weapons/rebuild-hope.png',
    description: 'Espada restaurada com esperança renovada',
    stats: {
      damage: 38,
      attackSpeed: 1.15,
      range: 65,
      critChance: 0.20,
      critMultiplier: 2.3,
    },
    ability: {
      name: 'Resiliência da Esperança',
      description: 'Regenera 1% HP por morte. Sobreviver <10% HP: buff temporário. Converte dano em escudo',
      effect: 'regen_per_kill_survival_buff_damage_shield',
    },
    levelRequirement: 21,
  },

  'shatterd-hope': {
    id: 'shatterd-hope',
    name: 'Esperança Despedaçada',
    category: WeaponCategory.SWORD,
    rarity: WeaponRarity.LEGENDARY,
    imagePath: '/weapons/shatterd-hope.png',
    description: 'Espada corrompida pelo desespero',
    stats: {
      damage: 45,
      attackSpeed: 1.0,
      range: 70,
      critChance: 0.18,
      critMultiplier: 2.7,
      areaOfEffect: 90,
    },
    ability: {
      name: 'Desespero Absoluto',
      description: 'Mais dano quanto mais inimigos na tela. Cercado: ataque vira explosão área',
      effect: 'crowd_damage_desperation_explosion',
    },
    levelRequirement: 21,
  },
};

// Função helper para obter arma por ID
export function getWeaponData(weaponId: WeaponType): WeaponData {
  return WEAPONS_DATABASE[weaponId];
}

// Função helper para obter todas as armas de uma raridade
export function getWeaponsByRarity(rarity: WeaponRarity): WeaponData[] {
  return Object.values(WEAPONS_DATABASE).filter(weapon => weapon.rarity === rarity);
}

// Função helper para obter todas as armas de uma categoria
export function getWeaponsByCategory(category: WeaponCategory): WeaponData[] {
  return Object.values(WEAPONS_DATABASE).filter(weapon => weapon.category === category);
}

// Função helper para obter armas disponíveis para um nível
export function getAvailableWeapons(playerLevel: number): WeaponData[] {
  return Object.values(WEAPONS_DATABASE).filter(weapon => weapon.levelRequirement <= playerLevel);
}

// Função para gerar arma aleatória baseada em raridade e nível
export function getRandomWeapon(playerLevel: number): WeaponData {
  const availableWeapons = getAvailableWeapons(playerLevel);

  // Sistema de peso por raridade
  const rarityWeights = {
    [WeaponRarity.COMMON]: 50,
    [WeaponRarity.UNCOMMON]: 30,
    [WeaponRarity.RARE]: 15,
    [WeaponRarity.EPIC]: 4,
    [WeaponRarity.LEGENDARY]: 1,
  };

  // Criar pool ponderado
  const weightedPool: WeaponData[] = [];
  availableWeapons.forEach(weapon => {
    const weight = rarityWeights[weapon.rarity];
    for (let i = 0; i < weight; i++) {
      weightedPool.push(weapon);
    }
  });

  // Selecionar aleatório do pool
  const randomIndex = Math.floor(Math.random() * weightedPool.length);
  return weightedPool[randomIndex];
}
