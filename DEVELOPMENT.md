# Bug Survivor - Game Structure

## 🏗️ Estrutura do Projeto

A estrutura foi organizada seguindo o padrão sugerido no README:

```
src/
├─ app/
│   ├─ page.tsx              # Menu principal
│   ├─ game/
│   │   └─ page.tsx          # Página do jogo
│   ├─ layout.tsx
│   └─ globals.css
├─ game/
│   ├─ core/                 # Engine e game loop
│   │   └─ GameEngine.ts
│   ├─ entities/             # Entidades do jogo
│   │   └─ Player.ts
│   ├─ systems/              # Sistemas (colisão, spawn, etc)
│   │   └─ CollisionSystem.ts
│   ├─ weapons/              # Lógica das armas
│   ├─ upgrades/             # Perks e evoluções
│   └─ config/               # Configurações e balanceamento
│       └─ gameConfig.ts
├─ components/               # Componentes React
│   └─ MainMenu.tsx
├─ hooks/                    # Custom hooks
├─ utils/                    # Utilitários
│   ├─ math.ts
│   └─ helpers.ts
└─ public/                   # Assets
    ├─ fundos home/
    ├─ explosoes/
    └─ ...
```

## ✅ Implementado

### Menu Principal
- ✅ Background com imagem (origbig.png)
- ✅ Estética cyberpunk (neon, grid, efeitos)
- ✅ Botões: Iniciar Jogo, Upgrades, Opções, Sobre
- ✅ Efeitos hover e animações

### Game Engine
- ✅ Game loop com requestAnimationFrame
- ✅ Delta time calculation
- ✅ Update/Render callbacks
- ✅ Pause/Resume/Stop

### Player
- ✅ Movimento WASD/Setas
- ✅ Sistema de vida e XP
- ✅ Level up
- ✅ Renderização básica

### Página do Jogo
- ✅ Canvas renderizado
- ✅ Grid cyberpunk
- ✅ HUD básico (FPS, Level, XP, HP)
- ✅ Menu de pausa (ESC)
- ✅ Controles funcionais

### Utils
- ✅ Funções matemáticas (normalizeVector, distance, lerp, clamp, etc)
- ✅ Helpers (formatTime, formatNumber, generateId)
- ✅ Sistema de colisão (preparado)

## 🚧 Próximos Passos

### 1. Sistema de Inimigos
- [ ] Classe Enemy
- [ ] Spawn system com ondas
- [ ] IA básica (seguir player)
- [ ] Sistema de dano

### 2. Sistema de Armas
- [ ] Data Disk (discos orbitais)
- [ ] Laser Pointer
- [ ] Bug Swarm
- [ ] Sistema de projéteis

### 3. Sistema de Upgrades
- [ ] Menu de upgrade ao levelar
- [ ] Opções aleatórias
- [ ] Evoluções de armas

### 4. Progressão
- [ ] Drop de XP dos inimigos
- [ ] Sistema de meta-progressão
- [ ] Desbloqueáveis

### 5. Polimento
- [ ] Sprites e animações
- [ ] Efeitos sonoros
- [ ] Partículas e explosões
- [ ] Juice (screen shake, etc)

## 🎮 Como Jogar (Estado Atual)

1. Execute: `npm run dev`
2. Abra: http://localhost:3000
3. Clique em "INICIAR JOGO"
4. Use WASD ou Setas para mover
5. ESC para pausar

## 🔧 Configuração

As configurações do jogo estão em:
- `game/config/gameConfig.ts`

Ajuste valores como velocidade do player, spawn rate, dano, etc.
