# Sistema de Efeitos de Área

## Visão Geral
O sistema de efeitos de área (Area Effect System) gerencia poderes especiais que causam dano em área no mapa. Cada efeito possui animações em sprite sheet com diferentes frames.

## Tipos de Efeitos

### 1. Tempestade de Raios (Lightning)
- **Dano Base:** 50
- **Raio:** 60px
- **Cooldown:** 8s
- **Animações:** 3 variantes aleatórias
  - Variante 1: 5 frames (raio_var_1)
  - Variante 2: 3 frames (raio_var_2)
  - Variante 3: 6 frames (raio_var_3)
- **Pasta:** `/public/efeitos/tempestade/`

### 2. Chuva de Fogo (Fire)
- **Dano Base:** 45
- **Raio:** 70px
- **Cooldown:** 7s
- **Frames:** 6
- **Pasta:** `/public/efeitos/fire/`

### 3. Explosão Atômica (Atomic)
- **Dano Base:** 80
- **Raio:** 90px
- **Cooldown:** 12s
- **Frames:** 10
- **Pasta:** `/public/efeitos/Explosion_atomic/`

### 4. Gás Tóxico (Toxic)
- **Dano Base:** 40
- **Raio:** 80px
- **Cooldown:** 6s
- **Frames:** 10
- **Pasta:** `/public/efeitos/Explosion_toxic/`

### 5. Explosão Elétrica (Electric)
- **Dano Base:** 55
- **Raio:** 65px
- **Cooldown:** 7s
- **Frames:** 10
- **Pasta:** `/public/efeitos/Explosion_eletric/`

### 6. Inferno Aquático (Water-Fire)
- **Dano Base:** 60
- **Raio:** 75px
- **Cooldown:** 9s
- **Frames:** 10
- **Pasta:** `/public/efeitos/Explosion_wather_and_fire/`

### 7. Explosão Padrão (Default)
- **Dano Base:** 35
- **Raio:** 50px
- **Cooldown:** 5s
- **Frames:** 10
- **Pasta:** `/public/efeitos/Explosion_defaut/`

## Sistema de Animação

### Carregamento de Sprites
- As animações são pré-carregadas no construtor do `AreaEffectSystem`
- Cada frame é uma imagem PNG separada
- Cache de frames para melhor performance
- Suporta diferentes padrões de nomenclatura de arquivos

### Nomenclatura de Arquivos
- **Padrão Normal:** `Explosion_1.png`, `Explosion_2.png`, etc.
- **Raios (var_2):** `Explosion_1_1.png`, `Explosion_1_2.png`, etc.
- **Raios (var_3):** `Explosion_2_1.png`, `Explosion_2_2.png`, etc.

### Renderização
- **Tamanho:** Raio do efeito × 3 × escala aleatória (0.8-1.2)
- **Rotação:** Aleatória (0-360°) para variação visual
- **Glow Effect:** Cor específica para cada tipo de efeito
- **Fade Out:** Reduz opacidade nos últimos 30% da animação
- **Fallback:** Círculo colorido se a imagem não carregar

### Efeitos Visuais
Cada tipo possui cor de glow específica:
- ⚡ Lightning: Azul (`#4488ff`)
- 🔥 Fire: Laranja (`#ff6600`)
- ☢️ Atomic: Verde (`#00ff00`)
- ☣️ Toxic: Verde-Amarelo (`#88ff00`)
- ⚡ Electric: Amarelo (`#ffff00`)
- 🌊 Water-Fire: Ciano (`#00ccff`)
- 💥 Default: Laranja (`#ff8800`)

## Mecânicas de Jogo

### Ativação
1. Player adquire o poder via upgrade de nível
2. Efeito é ativado automaticamente baseado no cooldown
3. Posição aleatória no mapa (via `triggerRandomEffect`)

### Upgrade
- Ao melhorar o efeito:
  - Dano: +20%
  - Raio: +10%
  - Cooldown: -10%

### Dano
- Inimigos dentro do raio recebem dano uma vez por explosão
- Dano é calculado no `CollisionSystem`
- `baseDamage × damageMultiplier`

## Integração

### No Game Loop
```typescript
// Update (verifica cooldown e dispara efeitos)
areaEffectSystem.update(deltaTime);

const activeEffects = areaEffectSystem.getActiveEffectTypes();
activeEffects.forEach(effectType => {
  const cooldown = areaEffectSystem.getEffectsCooldown(effectType);
  if (cooldown === 0) {
    areaEffectSystem.triggerRandomEffect(effectType, canvas.width, canvas.height, 1);
  }
});

// Render (desenha as animações)
areaEffectSystem.render(ctx);
```

### Verificar Status
```typescript
// Verificar se efeito está ativo
const isActive = areaEffectSystem.isEffectActive('lightning');

// Obter cooldown restante
const cooldown = areaEffectSystem.getEffectsCooldown('fire');

// Obter todos os efeitos ativos
const activeTypes = areaEffectSystem.getActiveEffectTypes();
```

## Adicionar Novos Efeitos

1. **Adicionar imagens:**
   - Criar pasta em `/public/efeitos/`
   - Nomear frames como `Explosion_1.png`, `Explosion_2.png`, etc.

2. **Configurar no código:**
   ```typescript
   this.configs.set('novo-efeito', {
     id: 'novo-efeito',
     name: 'Nome do Efeito',
     description: 'Descrição',
     baseDamage: 50,
     radius: 70,
     cooldown: 8,
     level: 1,
     currentLevel: 0,
     cost: 3,
     prerequisites: [],
     animationPath: '/efeitos/pasta-do-efeito',
     frameCount: 10,
     frameDuration: 0.08,
   });
   ```

3. **Adicionar cor de glow:**
   - Em `render()`, adicionar cor no objeto `glowColors`

4. **Adicionar no UpgradeSystem:**
   - Em `WeaponsDatabase.ts` ou onde os upgrades são definidos
   - Criar novo `AreaPowerUpgrade` com o tipo correspondente

## Performance

### Otimizações Implementadas
- ✅ Cache de frames carregados
- ✅ Pré-carregamento de todas as animações
- ✅ Remoção de efeitos inativos do array
- ✅ Verificação de cooldown antes de disparar
- ✅ Fallback visual leve se imagens não carregarem

### Recomendações
- Manter frames de animação abaixo de 15 por efeito
- Usar PNGs otimizados (comprimidos)
- Limitar número de efeitos simultâneos no mapa
- Considerar pool de objetos para efeitos futuros

## Estrutura de Arquivos

```
public/
└── efeitos/
    ├── tempestade/
    │   ├── raio_var_1/
    │   │   └── Explosion_1.png → Explosion_5.png
    │   ├── raio_var_2/
    │   │   └── Explosion_1_1.png → Explosion_1_3.png
    │   └── raio_var_3/
    │       └── Explosion_2_1.png → Explosion_2_6.png
    ├── fire/
    │   └── Explosion_1.png → Explosion_6.png
    ├── Explosion_atomic/
    │   └── Explosion_1.png → Explosion_10.png
    ├── Explosion_toxic/
    │   └── Explosion_1.png → Explosion_10.png
    ├── Explosion_eletric/
    │   └── Explosion_1.png → Explosion_10.png
    ├── Explosion_wather_and_fire/
    │   └── Explosion_1.png → Explosion_10.png
    └── Explosion_defaut/
        └── Explosion_1.png → Explosion_10.png
```
