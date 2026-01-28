# 🐞 Bug Survivor

**Bug Survivor** é um jogo **survivors-like (bullet heaven)** inspirado no gameplay de *Vampire Survivors*, mas ambientado em um **mundo cyberpunk** onde bugs digitais, vírus e entidades corrompidas tomaram conta do sistema.

Você controla um hacker/androide tentando sobreviver ao colapso do código enquanto ondas infinitas de inimigos invadem a tela. O ataque é automático — seu foco é **movimento, estratégia e escolhas inteligentes de upgrades**.

---

## 🎮 Gameplay

* Visão **top-down 2D** com renderização Canvas
* Personagem ataca automaticamente com múltiplas armas
* Inimigos surgem em **ondas progressivas** com 5 tipos diferentes
* **Sistema de bosses** desbloqueável após primeira vitória
* Objetivo: **sobreviver o máximo de tempo possível**
* Runs rápidas, caóticas e altamente viciantes

### Mecânicas principais

* 🕹️ **Movimento livre** com WASD ou setas
* ⚡ **Sistema de armas automáticas** com padrões únicos
* 🎯 **6 slots de armas** equipáveis simultaneamente
* 🧬 **Upgrades aleatórios** em 3 categorias por nível:
  * Armas (novas ou melhorias)
  * Stats (velocidade, vida, dano, etc.)
  * Poderes de Área (explosões automáticas)
* 💎 **XP Gems** coletáveis de inimigos derrotados
* 📦 **Baús de recompensa** que aparecem ao longo do mapa
* 🎨 **7 poderes de área** com animações em sprite sheet

---

## 🌆 Estética Cyberpunk

O universo de **Bug Survivor** mistura:

* Neon, glitches e efeitos holográficos
* Interfaces futuristas (HUD estilo terminal)
* Grid digital de fundo com animações
* Efeitos de partículas e explosões animadas
* Inimigos inspirados em:
  * Bugs de software (TV Head Man)
  * Vírus digitais
  * IA corrompida
  * Entidades de código quebrado
  * Inimigos Elite (após primeiro boss)

Cores predominantes:
* Roxo, ciano, magenta, verde neon
* Fundos escuros (#0a0a0a) com grid ciano translúcido
* Efeitos de glow coloridos por tipo de poder

---

## ⚔️ Sistema de Armas

### Armas Implementadas

#### 💿 **Espada de Madeira** (Inicial)
* Arma corpo a corpo básica
* Boa para começar
* Raridade: Comum

#### 🗡️ **Espada de Ferro**
* Arma melhorada de corpo a corpo
* Maior alcance e dano
* Raridade: Incomum

#### ⚔️ **Espada de Aço**
* Espada avançada
* Alto dano e velocidade
* Raridade: Rara

#### 💎 **Espada de Diamante**
* Espada lendária
* Dano massivo
* Raridade: Épica

#### 🔫 **Pistola**
* Projéteis rápidos e precisos
* Boa cadência de tiro
* Raridade: Comum

#### 🎯 **Rifle de Precisão**
* Alto dano por disparo
* Longo alcance
* Raridade: Incomum

#### 💥 **Shotgun**
* Múltiplos projéteis por disparo
* Curto alcance, alto dano
* Raridade: Rara

#### 🌀 **Lança-Chamas**
* Dano contínuo em cone
* Efeito de fogo persistente
* Raridade: Épica

#### 💿 **Data Disk** (Projétil)
* Discos que orbitam o jogador
* Atravessa múltiplos inimigos
* Raridade: Comum

### Sistema de Raridade
* **Comum** (Cinza): Armas básicas
* **Incomum** (Verde): Armas melhoradas
* **Rara** (Azul): Armas poderosas
* **Épica** (Roxa): Armas lendárias

Cada arma pode ser **melhorada até 5 níveis**, aumentando dano, velocidade e outros atributos.

---

## 💥 Poderes de Área

Sistema completo de efeitos de área com **animações em sprite sheet**:

### Tipos de Poderes

1. ⚡ **Tempestade de Raios**
   * Raios caem aleatoriamente no mapa
   * 3 variantes visuais diferentes
   * Dano: 50 | Raio: 60px | Cooldown: 8s

2. 🔥 **Chuva de Fogo**
   * Explosões de fogo em área
   * Dano: 45 | Raio: 70px | Cooldown: 7s

3. ☢️ **Explosão Atômica**
   * Explosões nucleares devastadoras
   * Dano: 80 | Raio: 90px | Cooldown: 12s

4. ☣️ **Gás Tóxico**
   * Nuvem tóxica venenosa
   * Dano: 40 | Raio: 80px | Cooldown: 6s

5. ⚡ **Explosão Elétrica**
   * Descargas elétricas potentes
   * Dano: 55 | Raio: 65px | Cooldown: 7s

6. 🌊 **Inferno Aquático**
   * Combinação letal de água e fogo
   * Dano: 60 | Raio: 75px | Cooldown: 9s

7. 💥 **Explosão Padrão**
   * Explosão básica de área
   * Dano: 35 | Raio: 50px | Cooldown: 5s

Cada poder:
* É **melhorável** (+20% dano, +10% raio, -10% cooldown)
* Possui **animação única** com múltiplos frames
* Ativa **automaticamente** baseado no cooldown
* Possui **efeito de glow** colorido específico

📖 Veja mais detalhes em [AREA_EFFECTS.md](AREA_EFFECTS.md)

---

## 👾 Inimigos

### Tipos Básicos (sempre disponíveis)
* **Chaser** - Persegue o jogador em linha reta
* **Wanderer** - Movimento aleatório pelo mapa
* **Tank** - Lento mas com muita vida

### Tipos Avançados (após level 5)
* **Ranged** - Atira projéteis à distância (spawn reduzido)

### Inimigos Elite (após derrotar primeiro boss)
* **Elite** - Versão mais forte de inimigos normais
* Maior vida, dano e velocidade
* Aparece em ondas especiais

### Sistema de Bosses
* Boss aparece após derrotar primeiro boss da run
* Inimigo massivo com muito HP
* Recompensas especiais ao derrotar

---

## 📊 Sistema de Stats

### Stats do Jogador

* ❤️ **Vida Máxima** - HP total do personagem
* 💚 **Regeneração** - Vida recuperada por segundo
* ⚡ **Velocidade** - Velocidade de movimento
* 🧲 **Alcance de Coleta** - Raio de coleta de XP
* 🛡️ **Defesa** - Redução de dano recebido
* 🎯 **Chance Crítica** - Probabilidade de dano crítico
* ⏱️ **Redução de Cooldown** - Reduz tempo de recarga
* 📏 **Tamanho de Projétil** - Aumenta área de impacto

### Stats de Armas

* ⚔️ **Dano Base** - Dano por hit
* 🗡️ **Velocidade de Ataque** - Ataques por segundo
* 💥 **Chance Crítica** - Chance de acerto crítico
* 🎯 **Área de Efeito** - Tamanho da área de dano
* 🔮 **Contagem de Projéteis** - Número de projéteis simultâneos
* ⭐ **Ganho de XP** - Multiplicador de experiência

---

## 🧠 Sistema de Progressão

### Durante a Run

* 💎 **Coleta de XP** - Gems caem de inimigos derrotados
* 📈 **Sistema de Níveis** - Suba de nível coletando XP
* 🎲 **Upgrades Aleatórios** - 3 opções a cada nível:
  * Nova arma ou melhoria
  * Melhoria de stat
  * Novo poder de área
* 📦 **Baús** - Aparecem durante a run com recompensas
* 🏆 **Contador de Kills** - Acompanhe suas eliminações
* ⏱️ **Tempo de Sobrevivência** - Quanto tempo você aguenta?

### Árvore de Upgrades Permanentes

Sistema de upgrades que persiste entre runs (localStorage):

* 18 nodes de melhoria permanente
* Salvo localmente no navegador
* Página dedicada em `/upgrades` para visualização
* Custos progressivos em moeda do jogo

📖 Detalhes técnicos em [DEVELOPMENT.md](DEVELOPMENT.md)

---

## 🎮 Controles

### Teclado

* **WASD** ou **Setas** - Movimento
* **E** - Abrir baú (quando próximo)
* **Ctrl + D** - Ativar Dev Mode (modo desenvolvedor)

### Dev Mode (Desenvolvedor)

Pressione **Ctrl + D** para ativar ferramentas de desenvolvimento:

* 🆙 **Level Up** - Sobe 1 nível instantaneamente
* 👹 **Spawn Boss** - Invoca um boss imediatamente
* 💊 **Heal** - Cura completamente o jogador
* ❤️ **+100 HP** - Adiciona 100 de HP máximo

⚠️ Só funciona com o jogo pausado

---

## 🛠️ Stack Tecnológica

### Frontend / Game Engine

* **Next.js 16.1.4** (App Router + Turbopack)
* **TypeScript** com strict mode
* **Canvas API** (renderização do jogo)
* **requestAnimationFrame** (game loop 60 FPS)

### Arquitetura do Jogo

* **GameEngine** - Loop principal (update/render)
* **Entity System**:
  * Player
  * Enemy (5 tipos)
  * Projectile
  * Chest
  * XP Drops
* **System Architecture**:
  * WeaponCombatSystem
  * CollisionSystem
  * EnemySpawner
  * ChestSpawner
  * XPDropSystem
  * AreaEffectSystem
  * ParticleSystem
  * SpriteAnimationSystem
  * UpgradeSystem
  * WeaponInventory

### Estilo & UI

* **Tailwind CSS**
* **shadcn/ui** components
* UI inspirada em **HUDs cyberpunk**
* Animações em sprite sheet (PNG sequences)
* Modais dinâmicos para upgrades e eventos

### Estado & Persistência

* React useState/useRef para estado do jogo
* localStorage para:
  * Árvore de upgrades permanentes
  * Configurações do jogador
* Refs para sistemas de jogo (evita re-renders)

---

## 🗂️ Estrutura de Pastas

```txt
bug-survivor/
├─ app/
│   ├─ game/
│   │   └─ page.tsx           # Página principal do jogo
│   ├─ upgrades/
│   │   └─ page.tsx           # Página de upgrades permanentes
│   ├─ globals.css
│   ├─ layout.tsx
│   └─ page.tsx               # Menu principal
├─ game/
│   ├─ config/
│   │   └─ gameConfig.ts      # Configurações de balanceamento
│   ├─ core/
│   │   └─ GameEngine.ts      # Engine principal do jogo
│   ├─ data/
│   │   ├─ EnemyDatabase.ts   # Dados dos inimigos
│   │   └─ WeaponsDatabase.ts # Dados das armas
│   ├─ entities/
│   │   ├─ Chest.ts
│   │   ├─ Enemy.ts
│   │   ├─ Player.ts
│   │   └─ Projectile.ts
│   ├─ systems/
│   │   ├─ AreaEffectSystem.ts        # Sistema de poderes de área
│   │   ├─ ChestSpawner.ts
│   │   ├─ CollisionSystem.ts
│   │   ├─ EnemySpawner.ts
│   │   ├─ ParticleSystem.ts
│   │   ├─ SpriteAnimationSystem.ts
│   │   ├─ StatusEffectManager.ts
│   │   ├─ WeaponCombatSystem.ts
│   │   ├─ WeaponInventory.ts
│   │   └─ XPDropSystem.ts
│   ├─ types/
│   │   ├─ AreaEffectTypes.ts
│   │   ├─ EnemyTypes.ts
│   │   ├─ UpgradeTypes.ts
│   │   └─ WeaponTypes.ts
│   ├─ upgrades/
│   │   └─ UpgradeSystem.ts   # Sistema de upgrades aleatórios
│   └─ weapons/
│       ├─ BaseWeapon.ts
│       ├─ DataDiskWeapon.ts
│       └─ SpecificWeapons.ts
├─ components/
│   ├─ AboutModal.tsx
│   ├─ DevMode.tsx            # Dev tools (Ctrl+D)
│   ├─ MainMenu.tsx
│   ├─ StarterWeaponModal.tsx
│   ├─ UpgradeSelectionModal.tsx
│   ├─ WeaponAcquiredModal.tsx
│   ├─ WeaponInventoryUI.tsx
│   └─ WeaponReplaceModal.tsx
├─ public/
│   ├─ efeitos/               # Animações de explosões
│   │   ├─ tempestade/        # 3 variantes de raios
│   │   ├─ fire/
│   │   ├─ Explosion_atomic/
│   │   ├─ Explosion_toxic/
│   │   ├─ Explosion_eletric/
│   │   ├─ Explosion_wather_and_fire/
│   │   └─ Explosion_defaut/
│   ├─ inimigos/
│   ├─ tvheadman/             # Sprites do personagem
│   ├─ weapons/
│   └─ hud/
├─ utils/
│   ├─ helpers.ts
│   └─ math.ts
├─ AREA_EFFECTS.md            # Documentação de efeitos de área
├─ DEVELOPMENT.md             # Guia de desenvolvimento
├─ WEAPONS.md                 # Sistema de armas detalhado
└─ README.md
```

---

## 🚀 Como Executar

### Pré-requisitos

* Node.js 18+ instalado
* npm ou yarn

### Instalação

```bash
# Clone o repositório
git clone https://github.com/vinicius-pascoal/bug-survivor.git

# Entre na pasta
cd bug-survivor

# Instale as dependências
npm install

# Execute em modo de desenvolvimento
npm run dev
```

Acesse `http://localhost:3000` no navegador.

### Build de Produção

```bash
npm run build
npm start
```

---

## 🚀 Roadmap

### ✅ Implementado

* ✅ Movimento e controles
* ✅ Sistema de câmera
* ✅ Spawn de inimigos em ondas (5 tipos)
* ✅ Sistema de armas automáticas (9 armas)
* ✅ Inventário de armas (6 slots)
* ✅ Upgrades aleatórios (3 categorias)
* ✅ Sistema de XP e níveis
* ✅ Colisão e dano
* ✅ HUD cyberpunk completo
* ✅ Baús de recompensa
* ✅ Poderes de área com animações
* ✅ Sistema de bosses
* ✅ Inimigos elite (pós-boss)
* ✅ Árvore de upgrades permanentes
* ✅ Dev Mode (Ctrl+D)
* ✅ Grid animado de fundo
* ✅ Sistema de raridades
* ✅ Modal de seleção de arma inicial
* ✅ Sistema de substituição de armas

### 🔨 Em Desenvolvimento

* [ ] Sons e música (synthwave/cyberpunk)
* [ ] Efeitos de partículas melhorados
* [ ] Mais tipos de inimigos
* [ ] Sistema de conquistas
* [ ] Leaderboard local

### 🎯 Planejado

* [ ] Múltiplos personagens jogáveis
* [ ] Mais armas e evoluções
* [ ] Diferentes mapas/arenas
* [ ] Efeitos de status (slow, burn, poison)
* [ ] Mobile support (touch controls)
* [ ] Salvamento de progresso online
* [ ] Modos de jogo alternativos
* [ ] Sistema de desafios diários

---

## 📚 Documentação Adicional

* 📖 [AREA_EFFECTS.md](AREA_EFFECTS.md) - Sistema completo de poderes de área e animações
* 📖 [WEAPONS.md](WEAPONS.md) - Detalhes de todas as armas implementadas
* 📖 [DEVELOPMENT.md](DEVELOPMENT.md) - Guia de desenvolvimento e arquitetura

---

## 🎮 Screenshots

### Menu Principal
Interface cyberpunk com neon e glitch effects

### Gameplay
* HUD informativo com HP, XP, tempo e kills
* Grid animado de fundo
* Múltiplas armas ativas simultaneamente
* Explosões de efeitos de área animadas
* Inventário visual de armas

### Modais
* Seleção de arma inicial
* Upgrades de nível (3 opções)
* Aquisição de nova arma
* Substituição de arma (inventário cheio)
* Game Over com estatísticas

---

## 🎯 Características Técnicas

### Performance

* 60 FPS constantes via requestAnimationFrame
* Sistema de colisão otimizado
* Cache de sprites para animações
* Renderização eficiente no Canvas
* Remoção automática de entidades inativas

### Balanceamento

* Spawn de inimigos escala com tempo
* Boss desbloqueável após vitória inicial
* Inimigos ranged com spawn reduzido (20%)
* Elite enemies gated até após primeiro boss
* Stats de armas balanceados por raridade
* Cooldowns ajustados para cada poder de área

### Qualidade de Código

* TypeScript strict mode
* Arquitetura modular (Systems/Entities)
* Separação de responsabilidades
* Tipos bem definidos
* Documentação inline
* ESLint configurado

---

## 🤝 Contribuindo

Contribuições são bem-vindas! Para contribuir:

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/NovaFeature`)
3. Commit suas mudanças (`git commit -m 'Add: Nova feature incrível'`)
4. Push para a branch (`git push origin feature/NovaFeature`)
5. Abra um Pull Request

### Áreas para Contribuição

* 🎵 Sistema de áudio/música
* 🎨 Novos sprites e animações
* 👾 Novos tipos de inimigos
* ⚔️ Novas armas
* 🎮 Melhorias de gameplay
* 📱 Suporte mobile
* 🐛 Correção de bugs

---

## 📄 Licença

Este projeto é de código aberto e está sob a licença MIT.

---

## 🧑‍💻 Autor

Desenvolvido por **Vinicius Pascoal** 🚀

* GitHub: [@vinicius-pascoal](https://github.com/vinicius-pascoal)
* Portfolio: [Em construção]

---

## 🙏 Agradecimentos

* Inspirado por **Vampire Survivors** e o gênero survivors-like
* Comunidade de game dev indie
* Assets cyberpunk da comunidade
* Next.js e Vercel team

---

> ⚠️ **Aviso:** Bug Survivor é um projeto independente criado para fins educacionais e de portfólio. Inspirado no gênero survivors-like, não possui afiliação com Vampire Survivors ou outros jogos comerciais.
