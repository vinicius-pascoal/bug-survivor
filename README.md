# 🐞 Bug Survivor

**Bug Survivor** é um jogo **survivors-like (bullet heaven)** inspirado no gameplay de *Vampire Survivors*, mas ambientado em um **mundo cyberpunk** onde bugs digitais, vírus e entidades corrompidas tomaram conta do sistema.

Você controla um hacker/androide tentando sobreviver ao colapso do código enquanto ondas infinitas de inimigos invadem a tela. O ataque é automático — seu foco é **movimento, estratégia e escolhas inteligentes de upgrades**.

---

## 🎮 Gameplay

* Visão **top-down 2D**
* Personagem ataca automaticamente
* Inimigos surgem em **ondas progressivas**
* Objetivo: **sobreviver o máximo de tempo possível**
* Runs rápidas, caóticas e altamente viciantes

### Mecânicas principais

* 🕹️ Movimento livre (teclado ou touch)
* ⚡ Armas automáticas com padrões únicos
* 🧬 Upgrades aleatórios por nível
* 🔗 Combinações de armas (evoluções)
* 📈 Progressão permanente entre runs

---

## 🌆 Estética Cyberpunk

O universo de **Bug Survivor** mistura:

* Neon, glitches e efeitos holográficos
* Interfaces futuristas (HUD estilo terminal)
* Inimigos inspirados em:

  * Bugs de software
  * Vírus digitais
  * IA corrompida
  * Entidades de código quebrado

Cores predominantes:

* Roxo, ciano, magenta, verde neon
* Fundos escuros com partículas e grid digital

---

## 🧠 Progressão

Durante a run:

* Coleta de **XP (dados)** ao derrotar inimigos
* Escolha de **upgrades aleatórios** a cada nível

Fora da run:

* Compra de melhorias permanentes
* Desbloqueio de novos personagens
* Desbloqueio de novas armas e perks

---

## 🧩 Exemplos de Armas

* 💿 **Data Disk** — discos giratórios que orbitam o jogador
* ⚡ **Laser Pointer** — feixe contínuo que atravessa inimigos
* 🐛 **Bug Swarm** — bugs digitais que perseguem inimigos
* 💣 **Packet Bomb** — explosões em área baseadas em tempo

---

## 🛠️ Stack Tecnológica

### Frontend / Game Engine

* **Next.js** (App Router)
* **TypeScript**
* **Canvas API** ou **SVG** (renderização do jogo)
* **requestAnimationFrame** (game loop)

### Estilo & UI

* **Tailwind CSS**
* **Framer Motion** (animações e transições)
* UI inspirada em **HUDs cyberpunk**

### Estado & Lógica

* Zustand ou Context API (estado global)
* Arquitetura baseada em:

  * Entities
  * Systems
  * Components (ECS simplificado)

### Áudio

* Web Audio API
* Efeitos sonoros glitch / synthwave

---

## 🗂️ Estrutura de Pastas (sugestão)

```txt
src/
 ├─ app/
 │   └─ page.tsx
 ├─ game/
 │   ├─ core/        # loop, engine, tempo
 │   ├─ entities/    # player, enemies, bullets
 │   ├─ systems/     # collision, movement, spawn
 │   ├─ weapons/     # lógica das armas
 │   ├─ upgrades/    # perks e evoluções
 │   └─ config/      # balanceamento
 ├─ components/
 ├─ hooks/
 ├─ styles/
 └─ utils/
```

---

## 🚀 Roadmap

* [ ] Movimento e câmera
* [ ] Spawn de inimigos em ondas
* [ ] Sistema de armas automáticas
* [ ] Upgrades aleatórios
* [ ] HUD cyberpunk
* [ ] Sons e efeitos visuais
* [ ] Progressão permanente
* [ ] Mobile support

---

## 🎯 Objetivo do Projeto

* Criar um jogo **divertido, rápido e altamente replayável**
* Explorar **game dev com Next.js + TypeScript**
* Servir como **projeto de portfólio** e base para expansão futura

---

## 🧑‍💻 Autor

Desenvolvido por **Vinicius Pascoal** 🚀

---

> ⚠️ Bug Survivor é um projeto independente, inspirado no gênero *survivors-like*. Não afiliado a Vampire Survivors.
