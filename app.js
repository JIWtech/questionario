const STORAGE_KEY = 'noria_questionario_casa_da_pizza_angra_v1';
const UNDEF = 'Ainda não definido', NA = 'Não se aplica', TO_TEAM = 'Encaminhar para a equipe';
const WEEKDAYS = ['Segunda','Terça','Quarta','Quinta','Sexta','Sábado','Domingo'];
const DELIVERY = 'Entrega (delivery)';

// Atalhos por pergunta: todas recebem "Ainda não definido", exceto as de fato/confirmação (plain).
// "Não se aplica" só onde a pergunta pode não existir; "Encaminhar para a equipe" só em condutas com o cliente.
const SHORTCUT_RULES = {
  plain:['1.2.1','1.2.2','2.1.1','2.1.2','2.2.5','2.3.5','3.1.3','3.1.4','3.1.5','3.1.6','3.1.8','4.1.1','4.1.5','5.2.2','5.2.7','6.1.2','6.2.3','8.2.2'],
  na:['1.1.2','1.1.7','2.1.3','2.2.2','2.3.1','2.3.2','3.1.9','4.1.4','5.1.9','5.2.8'],
  team:['5.1.8','6.2.1','6.2.4']
};
const shortcutsFor = id => SHORTCUT_RULES.plain.includes(id) ? [] :
  [UNDEF, ...(SHORTCUT_RULES.na.includes(id)?[NA]:[]), ...(SHORTCUT_RULES.team.includes(id)?[TO_TEAM]:[])];

const q = (id, text, type='textarea', extra={}) => ({id,text,type,quick:shortcutsFor(id),...extra});
const yesNo = (id,text,extra={}) => q(id,text,'radio',{options:['Sim','Não',...shortcutsFor(id)],...extra});
const choice = (id,text,options,extra={}) => q(id,text,'radio',{options:[...options,...shortcutsFor(id)],...extra});
const pick = (id,text,options,extra={}) => q(id,text,'radio',{options,...extra});
const multi = (id,text,options,extra={}) => q(id,text,'radio',{options,multi:true,...extra});

const sections = [
  {title:'1. Identidade e WhatsApp', subsections:[
    {title:'1.1 Nome e linguagem', questions:[
      choice('1.1.1','Qual nome comercial a IA deve usar?',['Casa da Pizza','Casa da Pizza Angra','Outro'],{other:true}),
      q('1.1.2','A atendente virtual terá um nome? Como ela deve se apresentar?'),
      q('1.1.3','Qual deve ser a mensagem de boas-vindas?'),
      choice('1.1.4','Quando o cliente já chegar pedindo (“quero uma grande de calabresa”), como a IA deve agir?',['Começar a anotar o pedido direto','Enviar o cardápio primeiro','Anotar e oferecer o cardápio na mesma mensagem','Outro'],{other:true}),
      choice('1.1.5','Qual tom de conversa combina com a pizzaria?',['Acolhedor e próximo','Rápido e objetivo','Consultivo (sugere sabores e combos)','Formal']),
      choice('1.1.6','A IA pode usar emojis?',['Sim, com moderação','Só em saudações e promoções','Não usar']),
      q('1.1.7','Quais palavras, gírias ou formas de tratamento devem ser evitadas?'),
      choice('1.1.8','O que responder quando perguntarem se estão falando com um robô?',['Dizer que é a assistente virtual da pizzaria','Dizer que é assistente virtual e oferecer um atendente','Outro'],{other:true})
    ]},
    {title:'1.2 WhatsApp e equipe', questions:[
      choice('1.2.1','O WhatsApp (24) 99871-8304, que aparece no Instagram, é o número que será conectado à NORIA?',['Sim','Não, será outro número'],{followupOn:'Não, será outro número',followupId:'1.2.1a',followupText:'Qual número será conectado?'}),
      choice('1.2.2','Quantas pessoas respondem esse WhatsApp hoje?',['1 pessoa','2 pessoas','3 ou mais']),
      q('1.2.3','Quem são essas pessoas e qual a função de cada uma? (ex.: Ana – caixa, João – dono)')
    ]}
  ]},
  {title:'2. Funcionamento e entrega', subsections:[
    {title:'2.1 Horários', questions:[
      choice('2.1.1','O Instagram informa “todos os dias, das 18h às 23h30”. Está correto?',['Sim, todos os dias','Não, há dias ou horários diferentes'],{followupOn:'Não, há dias ou horários diferentes',followupId:'2.1.1a',followupText:'Informe o horário de cada dia.'}),
      choice('2.1.2','Até que horas o último pedido pode ser feito?',['23h30','23h','Outro'],{other:true}),
      q('2.1.3','Há dias de folga fixa ou regras para feriados?'),
      choice('2.1.4','Quando alguém mandar mensagem fora do horário, o que a IA deve fazer?',['Informar o horário e não anotar pedido','Tirar dúvidas e avisar que os pedidos abrem às 18h','Anotar o pedido para quando abrir','Outro'],{other:true}),
      q('2.1.5','A partir de que horas a equipe começa a responder o WhatsApp?','text')
    ]},
    {title:'2.2 Endereço e formas de atendimento', questions:[
      q('2.2.1','Qual é o endereço completo da pizzaria?','text'),
      q('2.2.2','Qual ponto de referência ou link do Google Maps deve ser enviado?','text'),
      multi('2.2.3','Quais formas de atendimento vocês oferecem?',[DELIVERY,'Retirada no balcão','Consumo no local (salão)']),
      q('2.2.4','Quanto tempo leva, em média, para um pedido de retirada ficar pronto?','text',{condition:{id:'2.2.3',includes:'Retirada no balcão'}}),
      yesNo('2.2.5','É possível reservar mesa no salão?',{condition:{id:'2.2.3',includes:'Consumo no local (salão)'},followupOn:'Sim',followupId:'2.2.5a',followupText:'Como funciona a reserva (a partir de quantas pessoas, antecedência, dias)?'})
    ]},
    {title:'2.3 Regras de entrega', condition:{id:'2.2.3',includes:DELIVERY}, questions:[
      q('2.3.1','Existe pedido mínimo para entrega? Qual valor?','text'),
      q('2.3.2','Existe entrega grátis? A partir de qual valor ou em quais bairros?','text'),
      q('2.3.3','Qual tempo médio de entrega a IA pode informar? Muda na sexta e no sábado?'),
      choice('2.3.4','Quando o cliente for de um bairro fora da área de entrega, o que fazer?',['Oferecer retirada no balcão','Encaminhar para a equipe avaliar','Informar que não entregamos nesse local','Outro'],{other:true}),
      choice('2.3.5','Quem faz as entregas?',['Motoboys próprios','Motoboys terceirizados ou aplicativo','Os dois'])
    ]},
    {title:'2.4 Bairros atendidos e taxas', repeater:'zones', condition:{id:'2.2.3',includes:DELIVERY}, description:'Preencha uma ficha para cada bairro ou grupo de bairros com a mesma taxa. Ex.: “Centro, Balneário e Praia do Anil – R$ 5,00 – 40 min”.'}
  ]},
  {title:'3. Cardápio oficial', subsections:[
    {title:'3.1 Estrutura das pizzas', questions:[
      multi('3.1.1','Quais tamanhos de pizza vocês vendem?',['Broto','Pequena','Média','Grande','Gigante / Família','Outro'],{other:true,redraw:'flavors'}),
      q('3.1.2','Quantas fatias e qual o diâmetro (cm) de cada tamanho?'),
      choice('3.1.3','Quantos sabores podem ser combinados em uma pizza?',['Somente 1 sabor','Até 2 sabores (meio a meio)','Até 3 sabores','Até 4 sabores','Depende do tamanho'],{followupOn:'Depende do tamanho',followupId:'3.1.3a',followupText:'Quantos sabores em cada tamanho?'}),
      choice('3.1.4','Como é cobrada a pizza com mais de um sabor?',['Pelo sabor mais caro','Pela média dos sabores','Outro'],{other:true,condition:{id:'3.1.3',notIn:['Somente 1 sabor']}}),
      yesNo('3.1.5','Vocês têm borda recheada?',{followupOn:'Sim',followupId:'3.1.5a',followupText:'Quais sabores de borda e quanto custa em cada tamanho?'}),
      choice('3.1.6','O cliente pode tirar ou adicionar ingredientes?',['Pode tirar sem custo; adicionar é cobrado','Pode tirar e adicionar sem custo','Não aceitamos alterações','Outro'],{other:true}),
      q('3.1.7','Quais adicionais existem e quanto custam? (ex.: bacon extra, catupiry, cheddar)','textarea',{condition:{id:'3.1.6',in:['Pode tirar sem custo; adicionar é cobrado','Outro']}}),
      choice('3.1.8','Vocês têm o cardápio pronto para a IA enviar?',['Sim, em imagem','Sim, em PDF','Sim, em link (cardápio digital)','Não temos'],{followupOn:'Sim, em link (cardápio digital)',followupId:'3.1.8a',followupText:'Qual é o link?'}),
      q('3.1.9','Há opções vegetarianas, sem lactose ou sem glúten? Quais?')
    ]},
    {title:'3.2 Sabores de pizza', repeater:'flavors', description:'Preencha uma ficha por sabor. Os campos de preço aparecem conforme os tamanhos marcados em 3.1.1. Se preferir, envie a foto do cardápio junto com o PDF e preencha aqui apenas o que não aparece nela.'},
    {title:'3.3 Bebidas, combos e outros itens', repeater:'items', description:'Refrigerantes, sucos, cervejas, esfirras, calzones, porções, sobremesas e combos.'},
    {title:'3.4 Atualização do cardápio', questions:[
      choice('3.4.1','Quando um sabor ou bebida acabar no dia, o que a IA deve fazer?',['A equipe avisa no sistema e a IA deixa de oferecer','A IA sempre confirma com a equipe antes de fechar o pedido','Outro'],{other:true}),
      q('3.4.2','Quem vai avisar mudanças de preço, sabores novos e itens em falta?','text')
    ]}
  ]},
  {title:'4. Promoções, brindes e sorteios', subsections:[
    {title:'4.1 Regras gerais', questions:[
      yesNo('4.1.1','O Instagram mostra “Sextou” e “Sabadou”. Existem promoções fixas por dia da semana?'),
      choice('4.1.2','Qual desconto a IA pode oferecer por conta própria?',['Nenhum: só as promoções cadastradas abaixo','Outro'],{other:true}),
      choice('4.1.3','Quando perguntarem sobre sorteios, o que a IA deve responder?',['Indicar o Instagram @casadapizzaangra','Explicar as regras do sorteio atual','Encaminhar para a equipe','Outro'],{other:true}),
      q('4.1.4','Quais brindes existem hoje e em que condição o cliente ganha?'),
      yesNo('4.1.5','Existe cartão fidelidade ou cupom de desconto?',{followupOn:'Sim',followupId:'4.1.5a',followupText:'Como funciona e quem confere?'})
    ]},
    {title:'4.2 Promoções ativas', repeater:'promos', description:'Cadastre apenas as promoções em vigor. A IA nunca vai oferecer promoção que não esteja aqui.'}
  ]},
  {title:'5. Pedido e pagamento', subsections:[
    {title:'5.1 Como o pedido é montado', description:'No formato padrão da NORIA, a IA tira dúvidas e monta o pedido com o cliente. O pedido vai para a coluna de confirmação do Kanban e a equipe confirma o valor final e o tempo de entrega e lança no caixa.', questions:[
      multi('5.1.1','Por onde chegam os pedidos hoje?',['WhatsApp','Telefone','iFood ou outro aplicativo','Cardápio digital próprio','Balcão','Outro'],{other:true}),
      choice('5.1.2','Qual deve ser o papel da IA no pedido?',['Montar o pedido completo e passar para a equipe confirmar','Tirar dúvidas e enviar o link do cardápio digital','Tirar dúvidas e passar para a equipe anotar o pedido','Outro'],{other:true}),
      multi('5.1.3','Quais dados a IA precisa coletar antes de passar o pedido?',['Nome','Sabores e tamanhos','Bebidas e adicionais','Retirada ou entrega','Endereço completo','Bairro','Ponto de referência','Forma de pagamento','Troco para quanto','Observações (ex.: sem cebola)','CPF na nota']),
      yesNo('5.1.4','O cliente deve confirmar um resumo do pedido antes de ele ir para a equipe?'),
      choice('5.1.5','A IA pode informar o valor total?',['Sim, somando os preços do cardápio e a taxa de entrega','Informa como estimativa e a equipe confirma','Não, somente a equipe informa o valor final']),
      q('5.1.6','Qual mensagem a IA deve enviar quando o pedido for passado para a equipe?'),
      yesNo('5.1.7','Aceitam pedidos agendados (para mais tarde ou outro dia)?',{followupOn:'Sim',followupId:'5.1.7a',followupText:'Com quanta antecedência e em quais condições?'}),
      q('5.1.8','Como tratar pedidos grandes, festas e eventos?'),
      q('5.1.9','Vocês usam algum sistema de caixa ou de pedidos (ex.: Anota AI, Saipos, Goomer)? Qual?','text')
    ]},
    {title:'5.2 Pagamento', questions:[
      multi('5.2.1','Quais formas de pagamento são aceitas?',['Dinheiro','Pix','Cartão de crédito','Cartão de débito','Vale-refeição','Outro'],{other:true}),
      choice('5.2.2','No delivery, quando o pagamento é feito?',['Na entrega','Pix antecipado obrigatório','Pix antecipado só acima de um valor','O cliente escolhe','Outro'],{other:true,condition:{id:'2.2.3',includes:DELIVERY}}),
      q('5.2.3','Qual é a chave Pix?','text',{condition:{id:'5.2.1',includes:'Pix'}}),
      q('5.2.4','Qual é o nome do favorecido e o banco do Pix?','text',{condition:{id:'5.2.1',includes:'Pix'}}),
      choice('5.2.5','O que deve iniciar a conferência do Pix?',['Envio do comprovante','Qualquer aviso de pagamento','Outro'],{other:true,condition:{id:'5.2.1',includes:'Pix'}}),
      q('5.2.6','Quem confere os pagamentos via Pix?','text',{condition:{id:'5.2.1',includes:'Pix'}}),
      yesNo('5.2.7','O entregador leva maquininha de cartão?',{condition:{id:'2.2.3',includes:DELIVERY}}),
      q('5.2.8','Há acréscimo no cartão ou alguma condição de pagamento que a IA precise informar?')
    ]}
  ]},
  {title:'6. Problemas e cancelamento', subsections:[
    {title:'6.1 Acompanhamento do pedido', questions:[
      choice('6.1.1','Quando o cliente perguntar “cadê minha pizza?”, o que a IA deve fazer?',['Encaminhar sempre para a equipe','Informar o tempo médio e encaminhar se o prazo já passou','Outro'],{other:true}),
      yesNo('6.1.2','A equipe avisa o cliente quando o pedido sai para entrega?'),
      q('6.1.3','Até quando o cliente pode cancelar ou alterar o pedido?'),
      choice('6.1.4','A IA pode cancelar ou alterar um pedido sozinha?',['Não, sempre encaminhar para a equipe','Somente antes da confirmação da equipe','Outro'],{other:true})
    ]},
    {title:'6.2 Reclamações e cuidados', questions:[
      q('6.2.1','Qual mensagem deve ser enviada quando o cliente reclamar (pizza errada, fria, atrasada, faltando item)?'),
      q('6.2.2','Quem recebe as reclamações com prioridade?','text'),
      yesNo('6.2.3','Confirma que a IA nunca deve prometer reembolso, desconto ou nova pizza sem aprovação da equipe?'),
      q('6.2.4','Qual deve ser a resposta quando o cliente perguntar sobre alergia ou intolerância alimentar?'),
      q('6.2.5','Quais promessas a IA nunca pode fazer? (ex.: “chega em 20 minutos”)')
    ]}
  ]},
  {title:'7. Situações de conversa', subsections:[
    {title:'7.1 Respostas desejadas', scenarios:true, description:'Para cada situação, escreva a resposta desejada e marque se a IA continua atendendo ou encaminha para a equipe.'}
  ]},
  {title:'8. Equipe, Kanban e acompanhamento', subsections:[
    {title:'8.1 Encaminhamento para a equipe', questions:[
      multi('8.1.1','Em quais situações a IA deve chamar a equipe?',['Pedido montado, para confirmar','Cliente pediu um atendente','Reclamação','Cancelamento ou alteração','Atraso na entrega','Divergência no pagamento','Pedido grande ou evento','Alergia ou restrição alimentar','Bairro fora da área','Outro'],{other:true}),
      q('8.1.2','Qual mensagem padrão a IA deve enviar ao chamar a equipe?'),
      q('8.1.3','Quem deve receber cada tipo de caso? (ex.: pedidos – caixa; reclamações – dono)'),
      choice('8.1.4','Como devem ficar as colunas do Kanban (painel de conversas)?',['Padrão sugerido: Novos contatos > IA atendendo > Pedido para confirmar > Atendimento humano > Pedido concluído > Follow-ups','Quero outras colunas'],{followupOn:'Quero outras colunas',followupId:'8.1.4a',followupText:'Quais colunas, nesta ordem?'}),
      yesNo('8.1.5','Depois de chamar a equipe, a IA deve ficar em silêncio naquela conversa?'),
      q('8.1.6','Quem pode devolver a conversa para a IA?','text'),
      q('8.1.7','Qual prazo de resposta da equipe a IA pode informar?','text')
    ]},
    {title:'8.2 Contatos e mensagens automáticas', questions:[
      yesNo('8.2.1','A IA deve entender mensagens de áudio?'),
      yesNo('8.2.2','Existem contatos que só devem ser atendidos por pessoas? (entregadores, fornecedores, família)',{followupOn:'Sim',followupId:'8.2.2a',followupText:'Liste os números ou categorias.'}),
      choice('8.2.3','Quando o cliente começar um pedido e parar de responder, a IA deve retomar a conversa?',['Sim, depois de 15 a 30 minutos, na mesma noite','Sim, no dia seguinte','Não retomar','Outro'],{other:true}),
      yesNo('8.2.4','Deseja enviar promoções pelo WhatsApp para clientes antigos?',{followupOn:'Sim',followupId:'8.2.4a',followupText:'Com que frequência e em quais dias? Como o cliente pede para não receber mais?'}),
      q('8.2.5','Qual mensagem de agradecimento deve ser enviada ao concluir o atendimento?'),
      yesNo('8.2.6','Deseja pedir avaliação (Google ou Instagram) depois da entrega?',{followupOn:'Sim',followupId:'8.2.6a',followupText:'Qual link e em que momento?'})
    ]},
    {title:'8.3 Validação', questions:[
      q('8.3.1','Quais são as cinco perguntas mais frequentes dos clientes?'),
      q('8.3.2','Quais erros de atendimento não podem acontecer?'),
      q('8.3.3','Quem vai aprovar as respostas e avisar futuras mudanças de preço ou regras?','text'),
      q('8.3.4','Quais pedidos ou situações devem ser testados antes de ativar?')
    ]}
  ]}
];

const repeaters = {
  zones:{itemLabel:'Bairro / região', addLabel:'+ Adicionar bairro ou região', questions:[
    q('2.4.1','Bairro(s) ou região','text'),
    q('2.4.2','Taxa de entrega','text'),
    q('2.4.3','Tempo médio de entrega','text'),
    q('2.4.4','Observação (ex.: só até 22h, pedido mínimo diferente)','text')
  ]},
  flavors:{itemLabel:'Sabor', addLabel:'+ Adicionar outro sabor', questions:[
    q('3.2.1','Nome do sabor','text'),
    pick('3.2.2','Categoria',['Tradicional','Especial','Premium','Doce']),
    q('3.2.3','Ingredientes, do jeito que a IA deve descrever'),
    q('3.2.4','Preço em cada tamanho','prices'),
    pick('3.2.5','Disponibilidade',['Todos os dias','Só em alguns dias','Temporariamente fora do cardápio'])
  ]},
  items:{itemLabel:'Item', addLabel:'+ Adicionar outro item', questions:[
    q('3.3.1','Nome do item','text'),
    pick('3.3.2','Categoria',['Bebida','Esfirra / salgado','Calzone','Porção','Sobremesa','Combo','Outro']),
    q('3.3.3','Descrição, tamanho ou volume (ex.: Coca-Cola 2L)','text'),
    q('3.3.4','Preço','text')
  ]},
  promos:{itemLabel:'Promoção', addLabel:'+ Adicionar outra promoção', questions:[
    q('4.2.1','Nome da promoção','text'),
    multi('4.2.2','Dias válidos',WEEKDAYS),
    q('4.2.3','Regra e preço (ex.: 2 pizzas grandes tradicionais por R$ 89,90)'),
    multi('4.2.4','Vale para',['Delivery','Retirada','Salão']),
    pick('4.2.5','Acumula com outras promoções?',['Sim','Não']),
    q('4.2.6','Válida até (ou “sem data para acabar”)','text')
  ]}
};

const scenarios = [
  ['7.1.1','“Qual pizza vocês recomendam?”'],
  ['7.1.2','“Tem promoção hoje?”'],
  ['7.1.3','“Faz um desconto?”'],
  ['7.1.4','“Quanto tempo demora para chegar?”'],
  ['7.1.5','“Entrega no meu bairro?” (bairro fora da área)'],
  ['7.1.6','“Cadê meu pedido? Já faz uma hora.”'],
  ['7.1.7','“A pizza chegou fria / errada.”'],
  ['7.1.8','“Quero encomendar pizzas para uma festa no sábado.”'],
  ['7.1.9','“Vocês têm opção sem glúten ou sem lactose?”'],
  ['7.1.10','“Quero falar com uma pessoa.”'],
  ['7.1.11','A IA não entendeu um áudio ou uma mensagem.'],
  ['7.1.12','Mensagem recebida fora do horário de funcionamento.']
];

const emptyState = () => ({answers:{},repeaters:Object.fromEntries(Object.keys(repeaters).map(k=>[k,[{}]])),scenarios:{},meta:{},final:{}});
const repeaterDrawers = {};
let state = loadState();

function loadState(){
  try { const saved=JSON.parse(localStorage.getItem(STORAGE_KEY)); if(saved) return {...emptyState(),...saved}; } catch {}
  return emptyState();
}
function saveState(){
  collectFixed();
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch {}
  updateProgress();
}
function esc(v=''){ return String(v).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m])); }
function valueOf(id){ return state.answers[id] ?? ''; }
function isAnsweredValue(v){
  if(Array.isArray(v)) return v.length>0;
  if(v && typeof v==='object') return Object.values(v).some(x=>String(x??'').trim()!=='');
  return String(v??'').trim()!=='';
}
function conditionMet(cond){
  if(!cond) return true; const v=valueOf(cond.id);
  if(cond.equals!==undefined) return v===cond.equals;
  if(cond.in) return cond.in.includes(v);
  if(cond.includes) return Array.isArray(v)&&v.includes(cond.includes);
  if(cond.notIn) return isAnsweredValue(v)&&!cond.notIn.includes(v);
  return true;
}
function selectedSizes(){
  const v=valueOf('3.1.1'); if(!Array.isArray(v)) return [];
  const other=v.includes('Outro')?(state.answers['3.1.1__other']||'').split(/[,;]/).map(s=>s.trim()).filter(Boolean):[];
  return [...v.filter(x=>x!=='Outro'),...other];
}

function render(){
  const host=document.getElementById('questionnaire'); host.innerHTML='';
  const nav=document.getElementById('sectionNav'); nav.innerHTML='';
  sections.forEach((section,si)=>{
    const sectionId=`sec-${si+1}`;
    const link=document.createElement('a'); link.href=`#${sectionId}`; link.textContent=section.title; nav.appendChild(link);
    const box=document.createElement('section'); box.className='section-card'; box.id=sectionId;
    const h2=document.createElement('h2'); h2.textContent=section.title; box.appendChild(h2);
    section.subsections.forEach(sub=>{
      const s=document.createElement('div'); s.className='subsection';
      if(sub.condition) s.dataset.condition=JSON.stringify(sub.condition);
      const h3=document.createElement('h3'); h3.textContent=sub.title; s.appendChild(h3);
      if(sub.description){ const p=document.createElement('p'); p.className='desc'; p.textContent=sub.description; s.appendChild(p); }
      if(sub.repeater) renderRepeater(s,sub.repeater);
      else if(sub.scenarios) renderScenarios(s);
      else sub.questions.forEach(item=>s.appendChild(renderQuestion(item)));
      box.appendChild(s);
    });
    host.appendChild(box);
  });
  hydrateFixed(); applyVisibility(); updateProgress();
}

function renderQuestion(item, store=state.answers, prefix='', quick=true){
  const card=document.createElement('div'); card.className='question-card'; card.dataset.qid=item.id;
  if(item.condition) card.dataset.condition=JSON.stringify(item.condition);
  const label=document.createElement('div'); label.className='question-label';
  label.innerHTML=`<span class="question-number">${esc(item.id)}</span>${esc(item.text)}`; card.appendChild(label);
  const fieldKey=prefix+item.id;
  const saved=store[item.id] ?? '';
  let control;
  if(item.type==='radio'){
    control=document.createElement('div'); control.className='choice-grid'; control.dataset.field=fieldKey;
    item.options.forEach(opt=>{
      const lab=document.createElement('label'); lab.className='choice-pill';
      const inp=document.createElement('input'); inp.type=item.multi?'checkbox':'radio'; inp.name=fieldKey; inp.value=opt;
      if(item.multi){ const arr=Array.isArray(saved)?saved:[]; inp.checked=arr.includes(opt); }
      else inp.checked=saved===opt;
      const span=document.createElement('span'); span.textContent=opt; lab.append(inp,span); control.appendChild(lab);
      inp.addEventListener('change',()=>{
        if(item.multi){ store[item.id]=[...control.querySelectorAll('input:checked')].map(x=>x.value); }
        else store[item.id]=inp.value;
        saveState(); applyVisibility(); renderFollowupState(card,item,store);
        if(item.redraw) repeaterDrawers[item.redraw]?.();
      });
    });
    card.appendChild(control);
    if(item.other){
      const other=document.createElement('input'); other.type='text'; other.placeholder='Se escolheu “Outro”, descreva aqui'; other.className='other-input'; other.value=store[item.id+'__other']||'';
      other.addEventListener('input',()=>{store[item.id+'__other']=other.value; saveState();});
      if(item.redraw) other.addEventListener('change',()=>repeaterDrawers[item.redraw]?.());
      card.appendChild(other);
    }
  } else if(item.type==='prices'){
    const sizes=selectedSizes();
    const prices=(saved && typeof saved==='object')?saved:{};
    control=document.createElement('div'); control.className='price-grid';
    if(!sizes.length){ const p=document.createElement('p'); p.className='dependency-note'; p.textContent='Marque os tamanhos na pergunta 3.1.1 para preencher os preços.'; control.appendChild(p); }
    sizes.forEach(size=>{
      const lab=document.createElement('label'); lab.textContent=size;
      const inp=document.createElement('input'); inp.type='text'; inp.inputMode='decimal'; inp.placeholder='R$'; inp.value=prices[size]||'';
      inp.addEventListener('input',()=>{prices[size]=inp.value; store[item.id]=prices; saveState();});
      lab.appendChild(inp); control.appendChild(lab);
    });
    card.appendChild(control);
  } else {
    control=document.createElement(item.type==='text'?'input':'textarea');
    if(item.type==='text') control.type='text'; else control.rows=3;
    control.value=saved; control.dataset.field=fieldKey;
    control.addEventListener('input',()=>{store[item.id]=control.value; saveState();}); card.appendChild(control);
    if(quick && item.quick.length) addQuickButtons(card,control,store,item.id,item.quick);
  }
  renderFollowupState(card,item,store);
  return card;
}

function addQuickButtons(card,control,store,key,options){
  const quick=document.createElement('div'); quick.className='quick-actions';
  options.forEach(txt=>{ const b=document.createElement('button'); b.type='button'; b.textContent=txt; b.onclick=()=>{control.value=txt;store[key]=txt;saveState();}; quick.appendChild(b); });
  card.appendChild(quick);
}

function followupPairs(item){ return item.followupOn?[[item.followupOn,item.followupId,item.followupText]]:[]; }
function renderFollowupState(card,item,store){
  card.querySelectorAll('.inline-followup').forEach(x=>x.remove());
  followupPairs(item).forEach(([trigger,id,text])=>{
    if(store[item.id]!==trigger) return;
    const wrap=document.createElement('div'); wrap.className='inline-followup';
    const lab=document.createElement('label'); lab.textContent=text;
    const ta=document.createElement('textarea'); ta.rows=2; ta.value=store[id]||'';
    ta.addEventListener('input',()=>{store[id]=ta.value;saveState();}); lab.appendChild(ta); wrap.appendChild(lab); card.appendChild(wrap);
    addQuickButtons(wrap,ta,store,id,[UNDEF]);
  });
}

function applyVisibility(){
  document.querySelectorAll('[data-condition]').forEach(el=>{
    el.classList.toggle('hidden-question',!conditionMet(JSON.parse(el.dataset.condition)));
  });
  updateProgress();
}

function renderRepeater(container,key){
  const def=repeaters[key];
  if(!state.repeaters[key]?.length) state.repeaters[key]=[{}];
  const wrap=document.createElement('div'); wrap.className='repeater';
  const draw=()=>{
    wrap.innerHTML='';
    const list=state.repeaters[key];
    list.forEach((item,i)=>{
      const box=document.createElement('div'); box.className='repeat-item';
      const head=document.createElement('div'); head.className='repeat-head';
      const title=document.createElement('strong'); title.textContent=`${def.itemLabel} ${i+1}`; head.appendChild(title);
      if(list.length>1){ const rm=document.createElement('button'); rm.type='button'; rm.className='mini-btn remove-btn'; rm.textContent='Remover'; rm.onclick=()=>{list.splice(i,1);saveState();draw();}; head.appendChild(rm); }
      box.appendChild(head); def.questions.forEach(itemQ=>box.appendChild(renderQuestion(itemQ,item,`${key}-${i}-`,false))); wrap.appendChild(box);
    });
    const add=document.createElement('button'); add.type='button'; add.className='add-btn'; add.textContent=def.addLabel; add.onclick=()=>{list.push({});saveState();draw();}; wrap.appendChild(add); updateProgress();
  };
  repeaterDrawers[key]=draw;
  draw(); container.appendChild(wrap);
}

function renderScenarios(container){
  scenarios.forEach(([id,text])=>{
    if(!state.scenarios[id]) state.scenarios[id]={answer:'',route:''};
    const data=state.scenarios[id];
    const card=document.createElement('div'); card.className='question-card scenario-card';
    const label=document.createElement('div'); label.className='question-label'; label.innerHTML=`<span class="question-number">${id}</span>${esc(text)}`; card.appendChild(label);
    const ta=document.createElement('textarea'); ta.rows=3; ta.placeholder='Resposta desejada'; ta.value=data.answer||''; ta.addEventListener('input',()=>{data.answer=ta.value;saveState();}); card.appendChild(ta);
    const choices=document.createElement('div'); choices.className='choice-grid compact';
    ['Continuar com IA','Encaminhar para a equipe'].forEach(opt=>{ const lab=document.createElement('label'); lab.className='choice-pill'; const inp=document.createElement('input'); inp.type='radio'; inp.name=`route-${id}`; inp.value=opt; inp.checked=data.route===opt; inp.onchange=()=>{data.route=opt;saveState();}; const span=document.createElement('span'); span.textContent=opt; lab.append(inp,span); choices.appendChild(lab); });
    card.appendChild(choices); container.appendChild(card);
  });
}

const FIXED_FIELDS = ['meta_nome','meta_funcao','meta_data','meta_aprovador','final_pendencias','final_responsavel','final_data'];
function collectFixed(){
  const v=id=>document.getElementById(id)?.value||'';
  state.meta={nome:v('meta_nome'),funcao:v('meta_funcao'),data:v('meta_data'),aprovador:v('meta_aprovador')};
  state.final={pendencias:v('final_pendencias'),responsavel:v('final_responsavel'),data:v('final_data')};
}
function hydrateFixed(){
  const set=(id,val)=>{document.getElementById(id).value=val||'';};
  set('meta_nome',state.meta?.nome); set('meta_funcao',state.meta?.funcao); set('meta_data',state.meta?.data||new Date().toISOString().slice(0,10)); set('meta_aprovador',state.meta?.aprovador);
  set('final_pendencias',state.final?.pendencias); set('final_responsavel',state.final?.responsavel); set('final_data',state.final?.data);
  FIXED_FIELDS.forEach(id=>document.getElementById(id).addEventListener('input',saveState));
}

function visibleSubsections(){
  return sections.flatMap(sec=>sec.subsections.filter(sub=>conditionMet(sub.condition)).map(sub=>({sec,sub})));
}
function updateProgress(){
  let total=0,answered=0;
  const count=(v)=>{total++; if(isAnsweredValue(v)) answered++;};
  visibleSubsections().forEach(({sub})=>{
    if(sub.questions) sub.questions.forEach(item=>{
      if(!conditionMet(item.condition)) return;
      count(state.answers[item.id]);
      followupPairs(item).forEach(([trigger,id])=>{ if(state.answers[item.id]===trigger) count(state.answers[id]); });
    });
    if(sub.repeater) (state.repeaters[sub.repeater]||[]).forEach(store=>repeaters[sub.repeater].questions.forEach(x=>count(store[x.id])));
    if(sub.scenarios) scenarios.forEach(([id])=>{ const d=state.scenarios?.[id]||{}; count(d.answer); count(d.route); });
  });
  const pct=total?Math.round(answered/total*100):0;
  document.getElementById('progressBar').style.width=pct+'%'; document.getElementById('progressText').textContent=`${pct}% respondido`;
}
function setStatus(msg){ const s=document.getElementById('status'); s.textContent=msg; clearTimeout(setStatus.t); setStatus.t=setTimeout(()=>s.textContent='',5000); }

function displayAnswer(item,store=state.answers){
  const v=store[item.id]; let ans;
  if(Array.isArray(v)) ans=v.join(', ');
  else if(v && typeof v==='object') ans=Object.entries(v).filter(([,p])=>String(p).trim()).map(([s,p])=>`${s}: ${p}`).join(' | ');
  else ans=v;
  ans=ans||'Sem resposta';
  if(item.other && store[item.id+'__other']) ans += ` — ${store[item.id+'__other']}`;
  return ans;
}

// ---------- PDF ----------
function addPdfLine(doc,text,y,opts={}){
  const margin=15,width=180,size=opts.size||9.5; doc.setFont('helvetica',opts.bold?'bold':'normal'); doc.setFontSize(size); const lines=doc.splitTextToSize(String(text),width); const lh=size*0.45; if(y.y+lines.length*lh+3>282){doc.addPage();y.y=16;} doc.text(lines,margin,y.y); y.y+=lines.length*lh+2;
}
function addQA(doc,y,id,text,answer){ addPdfLine(doc,`${id} ${text}`,y,{bold:true}); addPdfLine(doc,`Resposta: ${answer||'Sem resposta'}`,y); y.y+=1; }
function fileSlug(){
  const clean=(state.meta?.nome||'cliente').normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/[^a-zA-Z0-9_-]+/g,'-').replace(/^-|-$/g,'').toLowerCase();
  return `${clean||'cliente'}-${state.meta?.data||new Date().toISOString().slice(0,10)}`;
}
function generatePdf(){
  saveState(); if(!window.jspdf?.jsPDF){setStatus('Não foi possível carregar o gerador de PDF. Use “Imprimir / salvar como PDF”.');return;}
  const {jsPDF}=window.jspdf; const doc=new jsPDF({unit:'mm',format:'a4'}); const y={y:18};
  addPdfLine(doc,'Questionário de atendimento — Casa da Pizza',y,{bold:true,size:15}); addPdfLine(doc,'Levantamento para configuração do atendimento automatizado NORIA',y,{size:9.5}); y.y+=2;
  addPdfLine(doc,`Responsável pelas respostas: ${state.meta?.nome||'Sem resposta'}`,y); addPdfLine(doc,`Função: ${state.meta?.funcao||'Sem resposta'}`,y); addPdfLine(doc,`Data: ${state.meta?.data||'Sem resposta'}`,y); addPdfLine(doc,`Aprovador: ${state.meta?.aprovador||'Sem resposta'}`,y); y.y+=3;
  let lastSec=null;
  visibleSubsections().forEach(({sec,sub})=>{
    if(sec!==lastSec){ if(lastSec) y.y+=2; addPdfLine(doc,sec.title,y,{bold:true,size:12.5}); lastSec=sec; }
    addPdfLine(doc,sub.title,y,{bold:true,size:10.5});
    if(sub.repeater){
      const def=repeaters[sub.repeater];
      (state.repeaters[sub.repeater]||[]).forEach((store,i)=>{ addPdfLine(doc,`${def.itemLabel} ${i+1}`,y,{bold:true}); def.questions.forEach(item=>addQA(doc,y,item.id,item.text,displayAnswer(item,store))); });
    } else if(sub.scenarios){
      scenarios.forEach(([id,text])=>{ const d=state.scenarios?.[id]||{}; addQA(doc,y,id,text,d.answer||'Sem resposta'); addPdfLine(doc,`Destino: ${d.route||'Sem resposta'}`,y); });
    } else sub.questions.forEach(item=>{
      if(!conditionMet(item.condition)) return;
      addQA(doc,y,item.id,item.text,displayAnswer(item));
      followupPairs(item).forEach(([trigger,id,text])=>{ if(state.answers[item.id]===trigger) addQA(doc,y,id,text,state.answers[id]||'Sem resposta'); });
    });
    y.y+=1;
  });
  y.y+=2;
  addPdfLine(doc,'Pendências antes da ativação',y,{bold:true,size:10.5}); addPdfLine(doc,state.final?.pendencias||'Sem resposta',y); addPdfLine(doc,`Responsável pela aprovação final: ${state.final?.responsavel||'Sem resposta'}`,y); addPdfLine(doc,`Data da aprovação: ${state.final?.data||'Sem resposta'}`,y);
  doc.save(`questionario-casa-da-pizza-${fileSlug()}.pdf`); setStatus('PDF gerado. Agora é só enviar o arquivo pelo WhatsApp para a equipe NORIA.');
}

// ---------- Exportação no formato do sistema ----------
const TONE_IDS = {'Acolhedor e próximo':'friendly','Rápido e objetivo':'direct','Consultivo (sugere sabores e combos)':'consultative','Formal':'formal'};
function parsePrice(v){
  let s=String(v||'').replace(/[^\d,.]/g,'');
  if(!s) return null;
  if(s.includes(',')) s=s.replace(/\./g,'').replace(',','.');
  else if(/\.\d{3}$/.test(s)) s=s.replace(/\./g,'');
  const n=Number.parseFloat(s); return Number.isFinite(n)?n:null;
}
function slugify(v){ return String(v||'').normalize('NFD').replace(/[̀-ͯ]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'_').replace(/^_|_$/g,''); }
function ans(id){
  const v=state.answers[id]; const other=state.answers[id+'__other'];
  if(Array.isArray(v)) return v.includes('Outro')&&other?[...v.filter(x=>x!=='Outro'),other]:v;
  if(v==='Outro'&&other) return other;
  return isAnsweredValue(v)?v:null;
}
function filled(list){ return (list||[]).filter(x=>Object.values(x).some(isAnsweredValue)); }

function buildSystemExport(){
  saveState();
  const a=ans; const delivers=conditionMet({id:'2.2.3',includes:DELIVERY}); const pix=conditionMet({id:'5.2.1',includes:'Pix'});
  const flavors=filled(state.repeaters.flavors).filter(f=>isAnsweredValue(f['3.2.1']));
  const items=filled(state.repeaters.items).filter(f=>isAnsweredValue(f['3.3.1']));
  const catalog=[
    ...flavors.map(f=>{
      const raw=(f['3.2.4']&&typeof f['3.2.4']==='object')?f['3.2.4']:{};
      const bySize=Object.fromEntries(Object.entries(raw).filter(([,p])=>String(p).trim()).map(([s,p])=>[s,parsePrice(p)]));
      const values=Object.values(bySize).filter(n=>n!==null);
      return {external_source:'questionario_onboarding', external_id:`pizza_${slugify(f['3.2.1'])}`, category:`Pizza ${f['3.2.2']||''}`.trim(), name:f['3.2.1'], description:f['3.2.3']||null, billing_unit:'pizza',
        price:values.length?Math.min(...values):null, notes:displayAnswer({id:'3.2.4'},f), active:f['3.2.5']!=='Temporariamente fora do cardápio',
        metadata:{kind:'pizza', prices_by_size:bySize, prices_raw:raw, availability:f['3.2.5']||null}};
    }),
    ...items.map(f=>({external_source:'questionario_onboarding', external_id:`item_${slugify(f['3.3.2'])}_${slugify(f['3.3.1'])}`, category:f['3.3.2']||'Outro', name:f['3.3.1'], description:f['3.3.3']||null, billing_unit:'unidade',
      price:parsePrice(f['3.3.4']), notes:f['3.3.4']||null, active:true, metadata:{kind:'item', price_raw:f['3.3.4']||null}}))
  ];
  return {
    contract:'noria_onboarding_form_v1',
    review_required:true,
    review_note:'Rascunho gerado pelo questionário. Nada deve ser aplicado no Supabase sem revisão da equipe NORIA e aprovação do cliente.',
    generated_at:new Date().toISOString(),
    filled_by:state.meta, approval:state.final,
    tenant:{name:a('1.1.1')||'Casa da Pizza', suggested_slug:'casa_da_pizza_angra', industry:'Pizzaria e delivery', segment:'retail_sales', capability:'sales_v1',
      tone:TONE_IDS[a('1.1.5')]||null, tone_raw:a('1.1.5'), persona:a('1.1.2'), greeting:a('1.1.3'), first_message_behavior:a('1.1.4'), emoji_policy:a('1.1.6'), avoid_terms:a('1.1.7'), ai_disclosure:a('1.1.8')},
    channel:{type:'whatsapp', phone:a('1.2.1')==='Sim'?'5524998718304':(a('1.2.1a')||null), operators_count:a('1.2.2'), operators:a('1.2.3')},
    business_facts:{
      name:a('1.1.1')||'Casa da Pizza',
      locations:[{id:'angra', name:'Casa da Pizza', address:a('2.2.1'), reference:a('2.2.2'), verified:false, verified_source:'Questionário de onboarding (pendente de conferência)'}],
      hours:{confirmed_instagram:a('2.1.1')==='Sim, todos os dias', instagram:'Todos os dias, 18h às 23h30', custom:a('2.1.1a'), last_order:a('2.1.2'), closed_days_holidays:a('2.1.3'), team_response_from:a('2.1.5'), out_of_hours_behavior:a('2.1.4')},
      service_modes:a('2.2.3')||[], pickup_ready_minutes:a('2.2.4'), table_reservation:{allowed:a('2.2.5'), rules:a('2.2.5a')},
      delivery:delivers?{
        min_order:a('2.3.1'), free_delivery:a('2.3.2'), average_time:a('2.3.3'), out_of_area:a('2.3.4'), couriers:a('2.3.5'),
        zones:filled(state.repeaters.zones).map(z=>({area:z['2.4.1']||null, fee_raw:z['2.4.2']||null, fee:parsePrice(z['2.4.2']), eta:z['2.4.3']||null, notes:z['2.4.4']||null}))
      }:null,
      menu_rules:{sizes:selectedSizes(), slices_and_diameter:a('3.1.2'), max_flavors:a('3.1.3'), max_flavors_by_size:a('3.1.3a'), multi_flavor_pricing:a('3.1.4'), stuffed_crust:{offered:a('3.1.5'), details:a('3.1.5a')},
        customization:a('3.1.6'), add_ons:a('3.1.7'), menu_asset:{type:a('3.1.8'), link:a('3.1.8a')}, dietary_options:a('3.1.9'), out_of_stock_behavior:a('3.4.1'), menu_owner:a('3.4.2')},
      promotions:{weekday_promotions:a('4.1.1'), ai_discount_authority:a('4.1.2'), raffles:a('4.1.3'), gifts:a('4.1.4'), loyalty:{exists:a('4.1.5'), details:a('4.1.5a')},
        active:filled(state.repeaters.promos).map(p=>({name:p['4.2.1']||null, days:p['4.2.2']||[], rule:p['4.2.3']||null, channels:p['4.2.4']||[], stackable:p['4.2.5']||null, valid_until:p['4.2.6']||null}))},
      payment:{methods:a('5.2.1')||[], delivery_payment_timing:a('5.2.2'), pix:pix?{key:a('5.2.3'), holder_and_bank:a('5.2.4'), verification_trigger:a('5.2.5'), verifier:a('5.2.6')}:null, card_machine_on_delivery:a('5.2.7'), card_conditions:a('5.2.8')}
    },
    catalog,
    order_flow:{current_channels:a('5.1.1'), ai_role:a('5.1.2'), required_fields:a('5.1.3')||[], customer_confirms_summary:a('5.1.4'), ai_total_policy:a('5.1.5'), handoff_message:a('5.1.6'),
      scheduled_orders:{allowed:a('5.1.7'), rules:a('5.1.7a')}, large_orders:a('5.1.8'), pos_system:a('5.1.9')},
    after_order:{where_is_my_order:a('6.1.1'), dispatch_notice:a('6.1.2'), cancel_window:a('6.1.3'), ai_can_cancel:a('6.1.4'), complaint_message:a('6.2.1'), complaint_owner:a('6.2.2'),
      no_refund_promises:a('6.2.3'), allergy_answer:a('6.2.4'), forbidden_promises:a('6.2.5')},
    scenarios:Object.fromEntries(scenarios.map(([id,text])=>[id,{situation:text,answer:state.scenarios?.[id]?.answer||null,route:state.scenarios?.[id]?.route||null}])),
    handoff:{triggers:a('8.1.1')||[], message:a('8.1.2'), routing:a('8.1.3'), silence_after_handoff:a('8.1.5'), return_to_ai_by:a('8.1.6'), human_response_time:a('8.1.7')},
    kanban:a('8.1.4')==='Quero outras colunas'?{custom:true, columns_raw:a('8.1.4a')}:{custom:false, stages:{
      sales_new:{name:'Novos contatos',allow_ai:true}, sales_qualifying:{name:'IA atendendo',allow_ai:true}, sales_hot:{name:'Pedido para confirmar',allow_ai:false},
      sales_human:{name:'Atendimento humano',allow_ai:false}, sales_closed:{name:'Pedido concluído',allow_ai:false,closed:true}, follow_ups:{name:'Follow-ups',allow_ai:false}}},
    automation:{audio_enabled:a('8.2.1'), contact_exclusion:{enabled:a('8.2.2'), list_raw:a('8.2.2a')}, follow_up:a('8.2.3'), broadcasts:{enabled:a('8.2.4'), rules:a('8.2.4a')},
      closing_message:a('8.2.5'), review_request:{enabled:a('8.2.6'), details:a('8.2.6a')}},
    validation:{faq:a('8.3.1'), forbidden_errors:a('8.3.2'), approver:a('8.3.3'), test_cases:a('8.3.4')},
    raw_state:state
  };
}
function exportJson(){
  const blob=new Blob([JSON.stringify(buildSystemExport(),null,2)],{type:'application/json'});
  const url=URL.createObjectURL(blob); const link=document.createElement('a');
  link.href=url; link.download=`questionario-casa-da-pizza-${fileSlug()}.json`; document.body.appendChild(link); link.click(); link.remove();
  setTimeout(()=>URL.revokeObjectURL(url),1000);
  setStatus('Arquivo JSON gerado para a equipe NORIA revisar e importar.');
}

document.getElementById('saveBtn').onclick=()=>{saveState();setStatus('Respostas salvas neste navegador.');};
document.getElementById('jsonBtn').onclick=exportJson;
document.getElementById('printBtn').onclick=()=>{saveState();window.print();};
document.getElementById('pdfBtn').onclick=generatePdf;
window.addEventListener('beforeunload',saveState);
render();
