import { ROUTES, createJourney, advanceMonth, getCurrent, validateJourney } from './model.js';

const KEY = 'lucas-future-island-v1';
const $ = (s) => document.querySelector(s);
const t = (zh, en) => state.lang === 'zh' ? zh : en;
const num = n => Number(n).toFixed(2).replace(/\.00$/, '');
const fresh = () => ({ version: 1, lang: 'zh', phase: 'welcome', basket: [], journey: createJourney(), checkpoints: [], quiz: 0 });
let state = fresh(), feedback = null, sound = false, storageAvailable = true;
try {
  const raw = JSON.parse(localStorage.getItem(KEY));
  const j = validateJourney(raw?.journey);
  if (raw?.version === 1 && j && ['welcome','basket','journey','quiz','complete'].includes(raw.phase)) {
    state = { version:1, lang:raw.lang === 'en' ? 'en' : 'zh', phase:raw.phase,
      basket:Array.isArray(raw.basket) ? [...new Set(raw.basket.filter(n=>Number.isInteger(n)&&n>=0&&n<6))] : [],
      journey:j, checkpoints:Array.isArray(raw.checkpoints) ? [...new Set(raw.checkpoints.filter(n=>[2,5,6].includes(n)&&n<=j.month))] : [],
      quiz:Number.isInteger(raw.quiz) && raw.quiz>=0 && raw.quiz<=3 ? raw.quiz : 0 };
    if ((state.phase==='quiz'||state.phase==='complete') && j.month!==12) state.phase='journey';
    if (state.phase==='complete' && state.quiz!==3) state.phase='quiz';
    if (state.phase==='quiz' && state.quiz===3) state.phase='complete';
  }
} catch { storageAvailable = false; }

const companies = [
  ['🍞','面包店','Bakery'], ['🧰','工具厂','Tool maker'], ['💻','电脑公司','Computers'],
  ['🚲','自行车厂','Bicycles'], ['💡','能源公司','Energy'], ['🧴','日用品公司','Daily essentials']
];

function question() {
  const m = state.journey.month;
  if (state.phase==='journey' && !state.checkpoints.includes(m)) {
    if (m===2) return { id:2, icon:'🧺', title:t('同样的叶币，哪次买得多？','Same money. More pieces?'),
      body:t('第 1 月每份 5 叶币，第 2 月每份 4 叶币。每个月都投入 10 叶币。','One piece cost 5 leaves in month 1 and 4 in month 2. We added 10 leaves each month.'),
      options:[t('第 1 月','Month 1'),t('第 2 月','Month 2'),t('一样多','The same')], correct:1,
      hint:t('10 ÷ 5 = 2 份；10 ÷ 4 = 2.5 份。再看看哪次更多？','10 ÷ 5 = 2 pieces. 10 ÷ 4 = 2.5 pieces. Which is more?'),
      success:t('对！按月放入相同金额，就是一种定投计划。价格低时，同样的钱买到更多份；价格还可能继续跌。','Yes! Adding the same amount regularly is a plan. A lower price buys more pieces, but the price can fall further.') };
    if (m===5) { const h=getCurrent(state.journey); return { id:5, icon:'☁️', title:t('风来了，篮子会消失吗？','Windy weather. Fewer pieces?'),
      body:t(`买入前，你有 ${num(h.unitsBefore)} 份。价格从 5 跌到 3 叶币。只看价格变化，原来的份数呢？`,`Before buying, you had ${num(h.unitsBefore)} pieces. The price fell from 5 to 3 leaves. What happened to those pieces just because the price fell?`),
      options:[t('原来的份数没变，但值的钱少了','Same pieces, worth less now'),t('份数自动变成一半','Half the pieces disappeared'),t('什么都没变，也没有亏损','Nothing changed; no loss')], correct:0,
      hint:t('价格牌变了，篮子的份数不会自动减少。但现在卖出能换到的钱确实少了。','A new price tag does not remove pieces. But those pieces really are worth less now.'),
      success:t('对！份数和价值是两回事。亏损不是你做错了题。我们理解变化，再和爸爸一起照顾长期计划。','Right! Pieces and value are different. A loss does not mean you failed. We learn what changed and review the long-term plan with Dad.') }; }
    if (m===6) return { id:6, icon:'🌱', title:t('分红不是魔法金币','Dividends are not magic'),
      body:t('这一月，每份先值 4.2 叶币。分出 0.2 后，篮子里剩 4 叶币；我们把分出来的叶币再买成份额。','This month, a piece was worth 4.2 leaves. It paid out 0.2, leaving 4 inside. We used the payout to buy more pieces.'),
      options:[t('分红让钱凭空变多了','The payout made free money'),t('钱从篮子里分出来，再投入','Money came out, then went back in'),t('以后每月都会有分红','A payout is promised every month')], correct:1,
      hint:t('只看分配这一步：4.2 = 4 + 0.2。钱只是换了位置，不是凭空增加。','For the payout alone: 4.2 = 4 + 0.2. The money moved; it did not appear from nowhere.'),
      success:t('答对了！再投资能增加份数。以后会值多少仍取决于投资表现，分红金额和时间也没有保证。','Exactly! Reinvesting adds pieces. Their future value still depends on the investment. Payout amounts and timing are not promised.') };
  }
  if(state.phase==='quiz') return [
    {id:'gift',icon:'💌',title:t('这份礼物，是送给谁的？','Who is this gift for?'),body:t('爸爸想按计划一点点投入，现在帮忙管理。','Dad plans to add a little regularly and help look after it for now.'),options:[t('未来的 Lucas','Future Lucas'),t('游戏里的商店','The game shop'),t('小狐狸船长','Captain Fox')],correct:0,hint:t('想想爸爸的信：这是给未来的你的礼物。','Remember Dad’s letter: this is a gift for your future.'),success:t('是你！你可以和爸爸一起认识这份属于你的长期礼物。','You! You and Dad can learn about this long-term gift together.')},
    {id:'risk',icon:'🌦️',title:t('等很久，一定能赚钱吗？','Does waiting guarantee a profit?'),body:t('小岛过完了一年。真实投资还会经历更多变化。','Our island has finished one year. Real investments will face many more changes.'),options:[t('一定会赚很多','Yes, lots of money'),t('不一定，也可能亏损','No. It can lose money too'),t('每个月都会变多','It grows every month')],correct:1,hint:t('时间给投资发展的机会，但不能保证结果。','Time gives an investment a chance to develop, but cannot promise the result.'),success:t('对！定投和长期持有都不保证赚钱。懂得这个，比猜中涨跌更重要。','Right! Regular investing and a long wait do not guarantee a profit. Understanding matters more than guessing prices.')},
    {id:'talk',icon:'🤝',title:t('如果家里的计划变了呢？','What if the family plan changes?'),body:t('假如爸爸说，以后每个月能投入的金额变了，要重新看看计划。','Imagine Dad says the amount he can add each month has changed, and wants to review the plan.'),options:[t('自己偷偷改变计划','Secretly change the plan'),t('无论发生什么都必须继续买','Keep buying no matter what'),t('和爸爸一起聊一聊','Talk it through with Dad')],correct:2,hint:t('长期计划也需要照顾真实生活。你和爸爸是同一队。','A long-term plan needs to fit real life. You and Dad are a team.'),success:t('没错！学习、提问、一起商量。你已经是未来小岛的小小守护者了。','Exactly! Learn, ask questions and talk together. You are a Future Island keeper!')}
  ][state.quiz];
  return null;
}

function save() {
  try { localStorage.setItem(KEY,JSON.stringify(state)); storageAvailable=true; } catch { storageAvailable=false; }
}
function currentChapter() { return ({welcome:0,basket:1,journey:2,quiz:3,complete:3})[state.phase]; }
function badgeCount() { return (state.phase!=='welcome'?1:0) + (['journey','quiz','complete'].includes(state.phase)?1:0) + state.checkpoints.length + (state.phase==='complete'?1:0); }
function primary(label,action,disabled=false) { return `<button class="primary" data-action="${action}" ${disabled?'disabled':''}>${label}<span aria-hidden="true">↗</span></button>`; }
function guide(){ return `<div class="guide"><span class="avatar" aria-hidden="true">🦊</span><div><strong>${t('阿栗 · 你的小岛向导','Pip · Your island guide')}</strong><small>${t('慢慢来，我们一起想','Take your time. Let’s think together.')}</small></div></div>`; }
function renderQuestion(q) {
  return `<span class="tag">${t('小小发现','A LITTLE DISCOVERY')} ${state.phase==='quiz'?`${state.quiz+1} / 3`:''}</span>${guide()}
    <h2>${q.title}</h2><p class="copy">${q.body}</p>
    <div class="options">${q.options.map((x,i)=>`<button class="option ${feedback?.choice===i?(feedback.correct?'correct':'incorrect'):''}" data-answer="${i}" ${feedback?.correct?'disabled':''}><span>${'ABC'[i]}</span>${x}</button>`).join('')}</div>
    ${feedback?`<div class="feedback ${feedback.correct?'success':''}" role="status"><strong>${feedback.correct?t('✦ 新发现！','✦ A new discovery!'):t('一起再看一眼','Let’s take another look')}</strong>${feedback.correct?q.success:q.hint}</div>`:''}
    ${feedback?.correct?primary(t('我懂了，继续！','Got it. Let’s go!'),'continue'):''}
    <p class="small-note">${t('可以再试，没有倒计时，也不扣分。','Try again any time. No timer. No lost points.')}</p>`;
}
function welcomeCard() {
  return `<span class="tag">01 / ${t('爸爸的时间礼物','A GIFT OF TIME')}</span>${guide()}
    <h2>${t('嗨，Lucas！<br>这座小岛属于未来的你。','Hi, Lucas!<br>This island is for future you.')}</h2>
    <div class="letter">${t('“我准备每个月放一点钱，买一篮子公司的小份额，送给长大的你。你不用猜明天的价格，我们一起慢慢了解它。”','“I plan to put in a little each month and buy small pieces of a basket of companies, as a gift for future you. You don’t need to guess tomorrow’s price. We’ll learn together.”')}<span class="signature">— ${t('爸爸','Dad')}</span></div>
    <p class="copy">${t('和阿栗走过 12 个游戏月份，发现这份礼物是怎么被照顾的。','Travel through 12 pretend months with Pip and discover how we look after this gift.')}</p>
    ${primary(t('领取我的小岛护照','Get my island passport'),'start')}
    <p class="small-note">${t('约 5–8 分钟 · 适合和爸爸一起玩','About 5–8 minutes · Lovely to play with Dad')}</p>`;
}
function basketCard() {
  return `<span class="tag">02 / ${t('一个篮子，很多公司','ONE BASKET, MANY COMPANIES')}</span>${guide()}
    <h2>${t('装满你的公司篮子','Pack your company basket')}</h2>
    <p class="copy">${t('点亮下面 6 家想象中的公司。我们要认识的是：一小份篮子，里面也可以有很多公司的小份额。','Tap all 6 pretend companies. One small piece of a basket can hold tiny investments in many companies.')}</p>
    <div class="basket-grid">${companies.map(([icon,zh,en],i)=>`<button class="company" data-company="${i}" aria-pressed="${state.basket.includes(i)}"><span class="emoji" aria-hidden="true">${icon}</span>${t(zh,en)} ${state.basket.includes(i)?'✓':''}</button>`).join('')}</div>
    <div class="basket-meter">🧺 ${t(`已装入 ${state.basket.length} / 6 家公司`,`Packed ${state.basket.length} / 6 companies`)}</div>
    ${primary(t('篮子准备好，启航！','Basket ready. Set sail!'),'sail',state.basket.length!==6)}
    <p class="small-note">${t('爸爸说的 IVV 也是投资篮子，实际包含更多公司。<br>这里的 6 家只用于说明，不是真实持仓。篮子也会涨跌。','Dad’s IVV is an investment basket with many more companies.<br>These 6 are pretend examples, not its holdings. Baskets can lose value too.')}</p>`;
}
function journeyCard() {
  const q=question(); if(q)return renderQuestion(q);
  const j=state.journey,h=getCurrent(j), done=j.month===12;
  if(!j.month)return `<span class="tag">03 / ${t('每个月的小约定','OUR MONTHLY PLAN')}</span>${guide()}<h2>${t('一月一点，向未来出发','A little each month')}</h2><p class="copy">${t('每个月，爸爸的补给船送来 <strong>10 枚叶币</strong>，买入公司篮子。不必猜哪一天最便宜。','Each month, Dad’s supply boat brings <strong>10 leaves</strong> to buy basket pieces. We don’t have to guess the cheapest day.')}</p><div class="quote"><span class="quote-icon">🧺</span><div><div class="quote-label">${t('第 1 月 · 一份篮子的价格','MONTH 1 · PRICE PER PIECE')}</div><div class="quote-number">5 <small>${t('叶币','leaves')}</small></div></div></div><p class="copy">${t('选一条天气路线。每条路线都能学到东西、拿到同样的徽章。','Choose a weather route. Both routes earn the same learning badges.')}</p>${routes()}${primary(t('第 1 月：投入 10 叶币','Month 1: add 10 leaves'),'month')}<p class="small-note">${t('叶币与价格都是虚构的，不代表真实收益。','Leaves and prices are imaginary, not return forecasts.')}</p>`;
  const gain=h.value-h.contributed;
  return `<span class="tag">03 / ${t('每个月的小约定','OUR MONTHLY PLAN')}</span>
    <div class="month-dots" aria-label="${j.month} / 12">${Array.from({length:12},(_,i)=>`<span class="month-dot ${i<j.month?'past':''} ${i===j.month-1?'current':''}"></span>`).join('')}</div>
    <h2>${done?t('一年航行，完成！','One year. Well travelled!'):t(`第 ${j.month} 月的补给到了`,`Month ${j.month}: supplies delivered`)}</h2>
    <p class="copy">${done?t('看一看：投入的钱和现在的价值，不是同一个数字。','Look: money added and today’s value are different numbers.'):t('同样的 10 叶币，因为价格不同，每次买到的份数也可能不同。','The same 10 leaves can buy different numbers of pieces at different prices.')}</p>
    <div class="quote"><span class="quote-icon">${done?'⛵':'🧺'}</span><div><div class="quote-label">${done?t('现在的价值','VALUE TODAY'):t('本月一份篮子的价格','THIS MONTH’S PRICE PER PIECE')}</div><div class="quote-number">${num(done?h.value:h.price)} <small>${t('叶币','leaves')}</small></div></div></div>
    <div class="calculation">${done?t(`爸爸一共投入 <strong>${h.contributed}</strong> 叶币。<br>现在比投入${gain<0?'少':'多'} <strong>${num(Math.abs(gain))}</strong> 叶币。${gain<0?'这一年有亏损，学习徽章照样属于你。':'这一年有增长，未来仍可能亏损。'}`,`Dad added <strong>${h.contributed}</strong> leaves.<br>Today’s value is <strong>${num(Math.abs(gain))}</strong> ${gain<0?'below':'above'} that. ${gain<0?'This route lost money. Your learning badges still count.':'This route grew. Future losses are still possible.'}`):t(`10 ÷ ${num(h.price)} ≈ 新买 <strong>${num(h.boughtUnits)}</strong> 份<br>${h.dividend?`另外，${num(h.dividend)} 叶币分红已再买入 ${num(h.reinvestedUnits)} 份。`:`现在共有 <strong>${num(h.units)}</strong> 份篮子。`}`,`10 ÷ ${num(h.price)} ≈ <strong>${num(h.boughtUnits)}</strong> new pieces<br>${h.dividend?`Also reinvested ${num(h.dividend)} leaves into ${num(h.reinvestedUnits)} pieces.`:`You now own <strong>${num(h.units)}</strong> pieces.`}`)}</div>
    ${done?primary(t('当爸爸的小老师','Be Dad’s little teacher'),'quiz'):primary(t(`第 ${j.month+1} 月：再投入 10 叶币`,`Month ${j.month+1}: add 10 leaves`),'month')}
    <p class="small-note">${t('徽章跟着学习解锁，不看赚了多少钱。','Badges celebrate learning, not how much money you made.')}</p>`;
}
function routes(){ return `<div class="route-select">${Object.entries(ROUTES).map(([key,r])=>`<button class="route-button ${state.journey.route===key?'selected':''}" data-route="${key}" aria-pressed="${state.journey.route===key}"><strong>${key==='meadow'?'🌤️':'🌧️'} ${t(r.labelZh,r.labelEn)}</strong>${key==='meadow'?t('有高有低，练习观察','Ups and downs to observe'):t('可能遇到更多风雨','More difficult weather')}</button>`).join('')}</div>`; }
function completeCard(){return `<span class="tag">04 / ${t('未来小岛守护者','FUTURE ISLAND KEEPER')}</span><h2>${t('Lucas，你可以教爸爸了！','Lucas, you can teach Dad!')}</h2><div class="certificate"><div class="medal" aria-hidden="true">🏅</div><strong>${t('小小长期计划家','Little Long-Term Planner')}</strong><p>${t('我知道：爸爸按计划一点点投入，<br>买一篮子公司的小份额，<br>它会涨跌，分红可以再投入。<br>这是给未来的我的礼物，<br>但不保证赚钱。','I know: Dad adds a little at a time<br>to buy pieces of a basket of companies.<br>Values change. Payouts can be reinvested.<br>This gift is for future me,<br>but profit is not promised.')}</p><div class="seal">LUCAS · FUTURE ISLAND · ${t('6 枚发现徽章','6 DISCOVERY BADGES')}</div></div><p class="copy">${t('现在请你告诉爸爸：价格变低时，为什么份数可以没变，但值的钱会变少？','Now tell Dad: when the price falls, how can you have the same pieces but less value?')}</p>${primary(t('换一种天气，再航行一次','Try the other weather route'),'replay')}<div class="actions"><button class="secondary" data-action="print">${t('打印我的证书','Print my certificate')}</button><button class="secondary" data-action="parent">${t('和爸爸聊一聊','A chat with Dad')}</button></div><p class="small-note">${t('两条路线，同样的认真，同样值得庆祝。','Two routes. The same learning. Both worth celebrating.')}</p>`;}
function chart(){
 const history=state.journey.history;if(!history.length)return '';
 const max=Math.max(130,...history.map(h=>h.value))*1.1;
 const points=(key)=>[{month:0,[key]:0},...history].map(h=>`${12+h.month/12*456},${90-h[key]/max*80}`).join(' ');
 return `<div class="chart-box"><div class="chart-heading"><strong>${t('小岛航行记录','Our journey log')}</strong><span>${t('游戏模拟 · 不是预测','Pretend prices · Not a forecast')}</span></div><svg viewBox="0 0 480 100" role="img" aria-label="${t('每月投入与当前价值的曲线，详细数字见下方记录','Money added and value over time. Exact figures in the table below.')}"><line x1="12" y1="90" x2="468" y2="90" stroke="#d6dfcc"/><polyline points="${points('contributed')}" fill="none" stroke="#b3a06c" stroke-dasharray="5 4" stroke-width="2"/><polyline points="${points('value')}" fill="none" stroke="#477d66" stroke-width="3" stroke-linejoin="round"/><text x="12" y="104" font-size="8" fill="#7c8c72">0</text><text x="454" y="104" font-size="8" fill="#7c8c72">12</text></svg><div class="chart-key"><span><i></i>${t('现在值多少','Value')}</span><span><i class="dashed"></i>${t('爸爸投入多少','Added by Dad')}</span></div><details><summary>${t('查看每月数字','See monthly figures')}</summary><div class="table-wrap"><table><thead><tr>${[t('月','Month'),t('价格','Price'),t('份数','Pieces'),t('已投入','Added'),t('价值','Value')].map(s=>`<th>${s}</th>`).join('')}</tr></thead><tbody>${history.map(h=>`<tr><td>${h.month}</td><td>${num(h.price)}</td><td>${num(h.units)}</td><td>${h.contributed}</td><td>${num(h.value)}</td></tr>`).join('')}</tbody></table></div></details></div>`;
}
function render({focus=false}={}){
  window.speechSynthesis?.cancel();
  save();document.documentElement.lang=state.lang==='zh'?'zh-CN':'en';
  $('#brand-sub').textContent=t('一份送给未来的礼物','A LITTLE GIFT FOR FUTURE YOU');
  $('#language').textContent=t('English','中文');$('#parent').textContent=t('给爸爸','For Dad');
  $('#sound').textContent=sound?t('◖ 朗读已开','◖ Read aloud on'):t('◖ 读给我听','◖ Read to me');$('#sound').setAttribute('aria-pressed',String(sound));
  $('#footer-note').textContent=t('用叶币学习，用时间想象。这里没有真钱。','Learn with leaves. Imagine with time. No real money here.');
  $('#save-state').textContent=storageAvailable?t('进度保存在这个浏览器','Saved in this browser'):t('本次可玩；浏览器无法保存进度','Playable now; this browser cannot save progress');
  const chap=currentChapter(),h=getCurrent(state.journey),j=state.journey;
  const chapters=[t('爸爸的礼物','Dad’s gift'),t('公司篮子','Company basket'),t('十二个月','Twelve months'),t('教教爸爸','Teach Dad')];
  const note=[t('从一个小约定开始','It starts with a little plan'),t('一个篮子，许多种可能','One basket, many companies'),t('天气会变，学习一直在','Weather changes. Learning stays.'),t('你学到的，比价格更重要','What you learn matters more than prices')][chap];
  const card=state.phase==='welcome'?welcomeCard():state.phase==='basket'?basketCard():state.phase==='journey'?journeyCard():state.phase==='quiz'?renderQuestion(question()):completeCard();
  $('#game').innerHTML=`<section class="heading"><div><p class="eyebrow">THE FUTURE ISLAND · ${t('卢卡斯的成长航线','A LITTLE ADVENTURE FOR LUCAS')}</p><h1>${t('Lucas 的<span>未来小岛</span>','Lucas’s <span>Future Island</span>')}</h1><p class="subtitle">${t('一月一点，给长大的自己一份礼物。','A little each month. A gift for the person you’ll become.')}</p></div><span class="chapter-pill"><span class="dot"></span>${t('亲子探索','EXPLORE TOGETHER')} · ${t('第','CHAPTER')} ${chap+1} / 4</span></section>
    <div class="layout"><section class="visual-column" aria-label="${t('小岛和学习记录','Island and learning log')}"><div class="scene"><img src="island.svg" alt="${t('绿树小岛、木屋、补给帆船和狐狸向导','A leafy island, a small cottage, a supply boat and a fox guide')}"><div class="scene-label"><span class="dot"></span>${t('LUCAS 的小岛','LUCAS’S ISLAND')}</div><div class="scene-stamp">EST.<br>2026</div>${j.month?`<div class="journey-mini">${t(ROUTES[j.route].labelZh,ROUTES[j.route].labelEn)}<strong>${t(`第 ${j.month} / 12 月`,`MONTH ${j.month} / 12`)}</strong>${t('每月 10 叶币','10 leaves every month')}</div>`:''}<div class="island-note"><span class="icon">${['💌','🧺','⛵','🌱'][chap]}</span><div><strong>${note}</strong><span>${t(`已收集 ${badgeCount()} / 6 枚发现徽章`,`Collected ${badgeCount()} / 6 discovery badges`)}</span></div></div></div>
      <div class="stats"><div class="stat"><div class="stat-label">${t('爸爸已投入','DAD HAS ADDED')}</div><div class="stat-value">${j.contributed}</div><div class="stat-unit">${t('叶币 · 游戏金额','leaves · pretend money')}</div></div><div class="stat"><div class="stat-label">${t('我拥有的篮子','MY BASKET PIECES')}</div><div class="stat-value">${num(j.units)}</div><div class="stat-unit">${t('份 · 可以有小数','pieces · including fractions')}</div></div><div class="stat stat-em"><div class="stat-label">${t('现在值多少','VALUE TODAY')}</div><div class="stat-value">${num(h?.value||0)}</div><div class="stat-unit">${t('叶币 · 会变化','leaves · this can change')}</div></div></div>${chart()}</section>
      <section class="card" id="mission" tabindex="-1" aria-label="${t('当前任务','Current mission')}">${card}</section></div>
    <ol class="journey-steps">${chapters.map((s,i)=>`<li class="${i===chap?'active':i<chap?'done':''}" ${i===chap?'aria-current="step"':''}><span class="step-no">${i<chap?'✓':String(i+1).padStart(2,'0')}</span>${s}</li>`).join('')}</ol>`;
  if(focus)$('#mission').focus({preventScroll:true});
  if(sound)speak();
}
function speak(){
  if(!('speechSynthesis' in window)) {sound=false;$('#sound').textContent=t('此浏览器没有朗读','Read-aloud unavailable');return;}
  speechSynthesis.cancel();
  const text=$('#mission').innerText.replace(/↗/g,'');
  const speech=new SpeechSynthesisUtterance(text);speech.lang=state.lang==='zh'?'zh-CN':'en-AU';speech.rate=0.85;
  const voice=speechSynthesis.getVoices().find(v=>v.lang.startsWith(state.lang==='zh'?'zh':'en'));if(voice)speech.voice=voice;
  speechSynthesis.speak(speech);
}
function parentDialog(){
 $('#parent-dialog').innerHTML=`<div class="close-row"><h2 id="parent-title">${t('和 Lucas 聊聊这份礼物','Talk about this gift with Lucas')}</h2><button class="modal-close" data-close aria-label="${t('关闭','Close')}">×</button></div>
 <p>${t('这款游戏对应你们聊过的计划：爸爸定期投入、为 Lucas 购买 IVV 一类的公司篮子，作为给他的长期礼物。游戏不表示真实账户已经开好或已经买入。','This game explains your plan: Dad regularly adds money to buy a basket such as IVV as a long-term gift for Lucas. It does not mean a real account has been opened or an investment made.')}</p>
 <ul><li>${t('先问：“你能用自己的话告诉我，爸爸在做什么吗？”','Ask: “Can you tell me in your own words what Dad is doing?”')}</li><li>${t('再问：“如果价格跌了，份数和价值有什么不同？”','Then: “If prices fall, what is different about pieces and value?”')}</li><li>${t('最后问：“为什么不能把分红当作免费金币？”','Finally: “Why is a dividend not free money?”')}</li></ul>
 <p>${t('现实对应：叶币 → 投资金额；公司篮子 → ETF；小份篮子 → 基金份额。爸爸负责真实账户与税务，Lucas 可以提问、观察和学习，不需要贡献零花钱。','Real-world connections: leaves → money invested; company basket → ETF; pieces → fund units. Dad handles the real account and tax. Lucas can ask, observe and learn, without contributing pocket money.')}</p>
 <p class="readonly-hint">${t('模型说明：每月 10 叶币、12 个月、两条固定的虚构价格路径；第 6 月按原有份额分配每份 0.2，报价由 4.2 降至 4，再按 4 再投资，随后投入当月 10 叶币。分配这一步本身不创造财富。为便于学习，允许小数份额，省略费用、税费与汇率，不模拟真实 IVV 分配日程或未来回报。画面数字四舍五入，计算保留精度。','Model: 10 leaves a month for 12 months, with two fixed fictional price paths. In month 6, existing pieces each pay 0.2; the price drops from 4.2 to 4, the payout is reinvested at 4, and then 10 new leaves are added. The payout alone creates no wealth. Fractional pieces are allowed. Fees, taxes and exchange rates are omitted. This does not model IVV’s real payout schedule or future returns. Displayed numbers are rounded; calculations retain precision.')}</p>
 <p class="readonly-hint">${t('只在当前浏览器保存进度，不收集孩子资料，也不连接投资账户。朗读使用浏览器语音功能。','Progress stays in this browser. No child profiles or investment accounts are connected. Read-aloud uses the browser’s speech feature.')}</p>
 <button class="secondary" data-reset>${t('从头重玩（仅重置本游戏）','Start over (this game only)')}</button><div id="reset-check"></div>`;
 $('#parent-dialog').showModal();
}
document.addEventListener('click',e=>{
 const answer=e.target.closest('[data-answer]');if(answer){const q=question();if(!q||feedback?.correct)return;const choice=Number(answer.dataset.answer);feedback={choice,correct:choice===q.correct};render();$('#mission .feedback')?.scrollIntoView({block:'nearest',behavior:'smooth'});return;}
 const company=e.target.closest('[data-company]');if(company&&state.phase==='basket'){const n=Number(company.dataset.company);state.basket=state.basket.includes(n)?state.basket.filter(x=>x!==n):[...state.basket,n];render();$(`[data-company="${n}"]`)?.focus({preventScroll:true});return;}
 const route=e.target.closest('[data-route]');if(route&&!state.journey.month){state.journey=createJourney(route.dataset.route);render();$(`[data-route="${state.journey.route}"]`)?.focus({preventScroll:true});return;}
 if(e.target.closest('[data-close]')){$('#parent-dialog').close();return;}
 if(e.target.closest('[data-reset]')){$('#reset-check').innerHTML=`<p>${t('确定重新开始吗？这会清除本游戏在此浏览器的学习进度。','Start again? This clears this game’s learning progress in this browser.')}</p><button class="secondary" data-confirm-reset>${t('确定，重新开始','Yes, start again')}</button>`;return;}
 if(e.target.closest('[data-confirm-reset]')){const lang=state.lang;state=fresh();state.lang=lang;feedback=null;$('#parent-dialog').close();render({focus:true});return;}
 const action=e.target.closest('[data-action]')?.dataset.action;if(!action)return;
 if(action==='start'&&state.phase==='welcome')state.phase='basket';
 if(action==='sail'&&state.phase==='basket'&&state.basket.length===6)state.phase='journey';
 if(action==='month'&&state.phase==='journey'&&!question())state.journey=advanceMonth(state.journey);
 if(action==='continue'&&feedback?.correct){if(state.phase==='journey')state.checkpoints.push(question().id);else if(state.phase==='quiz'){state.quiz++;if(state.quiz===3)state.phase='complete';}feedback=null;}
 if(action==='quiz'&&state.journey.month===12){state.phase='quiz';state.quiz=0;}
 if(action==='replay'){state.journey=createJourney(state.journey.route==='meadow'?'storm':'meadow');state.checkpoints=[];state.quiz=0;state.phase='journey';feedback=null;}
 if(action==='print'){window.print();return;}
 if(action==='parent'){parentDialog();return;}
 render({focus:true});
});
$('#language').addEventListener('click',()=>{state.lang=state.lang==='zh'?'en':'zh';render();});
$('#sound').addEventListener('click',()=>{sound=!sound;render();});
$('#parent').addEventListener('click',parentDialog);
window.addEventListener('pagehide',()=>window.speechSynthesis?.cancel());
render();
