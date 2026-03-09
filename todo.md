# TODO - Correções para Fidelidade Total ao Vídeo

## Dashboard
- [x] Hábitos da Semana: porcentagem total "0%" no canto superior direito do card
- [x] Tarefas da Semana: "0/0 0%" no canto superior direito
- [x] Accordion XP: cabeçalho "Ação" / "XP" como tabela, emoji "Progresso em meta (1x/dia)"
- [x] Renomear "Forja" → "Life" nos accordions Dashboard

## Hábitos
- [x] Tab Dashboards COMPLETA: Bem-estar, calendário dias, Tendências, Histórico
- [x] Tab Mês: setas < > com ícone calendário para navegar meses
- [x] Tab Hoje: círculos numerados clicáveis para marcar hábito

## Tarefas
- [x] Modal: toggle "Tarefa Recorrente" com switch, "Dias da semana" selecionáveis, Prioridade dropdown

## Metas
- [x] Wizard: ícone vermelho, barra progresso vermelha, 4 etapas completas

## Finanças
- [x] Sub-abas: 12 ícones, cada com conteúdo funcional
- [x] Cards mensais com ícone edição (lápis)

## Foco
- [x] Timer funcional, projetos criáveis, histórico de sessões

## Geral
- [x] Todos modais aceitam input e salvam dados
- [x] Todos botões têm ação funcional

## Backend & Login
- [x] Schema do banco de dados para hábitos, tarefas, metas, finanças, foco, água, XP
- [x] Rotas tRPC para CRUD de todas as entidades
- [x] Integrar autenticação OAuth no frontend
- [x] Conectar Dashboard ao backend
- [x] Conectar Hábitos ao backend
- [x] Conectar Tarefas ao backend
- [x] Conectar Metas ao backend
- [x] Conectar Finanças ao backend
- [x] Conectar Foco ao backend
- [x] Testes vitest para as rotas (10 testes passando)

## PWA
- [x] Manifest.json configurado
- [x] Service Worker para cache offline
- [x] Ícones PWA gerados
- [x] Meta tags iOS configuradas

## Notificações
- [x] Sistema de notificações global
- [x] Notificações integradas em todas as páginas

## Renomeação
- [x] Alterar VITE_APP_TITLE para "Sistema Life" (built-in, requer alteração manual em Settings > General)
- [x] Verificar e corrigir todas as referências restantes a "Forja" ou "Replica" (package.json atualizado)

## Notificações Push (PWA iOS)
- [x] Gerar VAPID keys para Web Push API
- [x] Atualizar Service Worker com push event handler
- [x] Criar rota backend para salvar push subscription
- [x] Criar rota backend para enviar notificações push
- [x] Implementar pedido de permissão no frontend (botão no app)
- [x] Agendar notificações automáticas (hábitos, tarefas, água, foco)

## Conquistas em Destaque & Perfil
- [ ] Popup Conquistas em Destaque (ícone medalha) com 3 slots para exibir no ranking
- [ ] Dropdown do Perfil (ícone pessoa) com Usuário/email, Perfil, Configurações, Sair
- [ ] Página de Perfil com foto de perfil, email, nome de exibição, botão Salvar
- [ ] Seção Segurança com alterar senha (atual, nova, confirmar)
- [ ] Seção Notificações com toggles (Hábitos, Metas, Comunidade)
- [ ] Seção Sobre com Últimas Atualizações v2.1.6
- [ ] Seção Conta com botão Sair da Conta
