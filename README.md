# Questionário interativo — Casa da Pizza (Angra dos Reis)

Levantamento de regras de atendimento para configurar a NORIA na pizzaria
[@casadapizzaangra](https://www.instagram.com/casadapizzaangra/). Segue o formato do
[questionario-interativo](https://github.com/JIWtech/questionario-interativo) (NB Bronze):
site estático, perguntas condicionais, fichas repetíveis, cenários de conversa com destino
IA/equipe, salvamento no navegador e exportação em PDF.

## Dados já levantados do Instagram (o cliente só confirma)

- Funcionamento: todos os dias, 18h às 23h30 (pergunta 2.1.1).
- WhatsApp: (24) 99871-8304 (pergunta 1.2.1).
- Divulga promoções, brindes e sorteios; destaques "Sextou" e "Sabadou" (seção 4).
- Endereço e cardápio não estão públicos: perguntados nas seções 2.2 e 3.

## Como as respostas viram configuração

O botão **Exportar dados para a NORIA (JSON)** gera um rascunho (`review_required: true`)
já no formato do sistema. Nada é aplicado automaticamente.

| Seção do questionário | Destino no sistema |
|---|---|
| 1. Identidade, tom, emojis | `tenants` (segmento `retail_sales`, capacidade `sales_v1`), `tone`, prompt via `promptFactory` |
| 1.2 WhatsApp e equipe | canal WhatsApp (Evolution), `team_agents` |
| 2. Horários, endereço, bairros e taxas | `business_facts` (locations, hours, delivery.zones) |
| 3. Sabores, tamanhos, bebidas | `tenant_service_catalog` (uma linha por sabor/item; preços por tamanho em `metadata.prices_by_size`) |
| 4. Promoções | `business_facts.promotions` — a IA só oferece o que estiver cadastrado |
| 5. Pedido e pagamento | fluxo do pedido + Pix/conferência (handoff para a equipe confirmar) |
| 6–7. Problemas e cenários | regras de handoff e respostas aprovadas |
| 8. Kanban, áudio, contatos, follow-up | `tenant_settings.sales.stages`, `audio_enabled`, `contact_exclusion`, `follow_up_policies`, broadcasts |

Colunas sugeridas no Kanban (8.1.4): Novos contatos (`sales_new`), IA atendendo
(`sales_qualifying`), Pedido para confirmar (`sales_hot`), Atendimento humano
(`sales_human`), Pedido concluído (`sales_closed`) e Follow-ups (`follow_ups`).

## Publicar no GitHub Pages

Publicado a partir de [JIWtech/questionario](https://github.com/JIWtech/questionario),
com `index.html`, `styles.css` e `app.js` na raiz.

1. **Settings → Pages → Build and deployment → Deploy from a branch**.
2. Selecione a branch `main` e a pasta `/ (root)`.
3. O link fica em `https://jiwtech.github.io/questionario/`.

## PDF

O botão **Gerar e baixar PDF** usa jsPDF via CDN. Sem internet ou com o CDN bloqueado,
use **Imprimir / salvar como PDF**.
