# XAI-Orientador

Aplicação web que ajuda iniciantes a responder: **"Como explicar o que meu modelo de Machine Learning está fazendo?"**

Roda 100% no navegador (sem backend, sem IA generativa). Mesma arquitetura do ML-Orientador.

## Fluxos

- **Montar meu plano**: 7 perguntas (modelo, tarefa, tipo de dado, pergunta a responder, público, correlação entre preditores, restrição). A pergunta de correlação é pulada para texto e imagem. Resultado: técnica principal, técnicas complementares, passo a passo, pacotes Python/R, alertas do caso, checagens de confiabilidade, como relatar, referências e premissas assumidas.
- **Minha explicação parece estranha**: descrição livre + 9 sintomas. Resultado: causa provável, intervenções, como conferir, referências.

Ambos exportam relatório `.docx`.

## Estrutura

```
src/
├── components/   OpcaoCard, TrilhaDecisao, Relatorio
├── data/         questions.ts, techniques.ts (24 técnicas), references.ts
├── engine/       plan.ts (Fluxo A), diagnosis.ts (Fluxo B), types.ts
├── pages/        Home, FluxoA, FluxoB, ResultadoA, ResultadoB
└── utils/        generateDocx.ts
```

Nova técnica: adicione em `data/techniques.ts` e use a chave em `engine/plan.ts`.

## Executar

```bash
npm install
npm run dev      # http://localhost:5173/xai-orientador/
npm run build
```

## Publicar no GitHub Pages

1. Crie o repositório `xai-orientador` (outro nome: ajuste `base` em `vite.config.ts`).
2. Faça push para a branch `main`.
3. **Settings → Pages → Source: GitHub Actions.** O workflow incluído publica a cada push.

URL: `https://SEU-USUARIO.github.io/xai-orientador/`
