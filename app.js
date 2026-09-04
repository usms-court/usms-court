document.addEventListener('DOMContentLoaded', () => {
    // 1. Единое состояние приложения
    const state = {
        currentTab: 'decree',
        settings: {
            prosecutorPosition: 'Директор USMS',
            prosecutorName: 'Dante DeRosse',
            prosecutorDiscord: '.dantezzz',
            prosecutorSignature: 'D. DeRosse',
            prosecutorSignatureLink: ''
        },
        decree: {
            orderNumber: '600',
            caseId: '',
            judgeName: '',
            judgeRank: 'окружного судьи',
            courtType: 'окружной',
            factionSelect: 'Гражданину',
            citizenName: '',
            obligations: []
        },
        interrogation: {
            name: '',
            passport: '',
            date: '',
            timeStart: '',
            timeEnd: '',
            place: '',
            present: '',
            summary: ''
        },
        wanted: {
            orderNumber: '600',
            caseId: '',
            judgeName: '',
            judgeRank: 'окружного судьи',
            courtType: 'окружного суда',
            wantedList: []
        }
    };

    // 2. DOM-элементы
    const navItems = document.querySelectorAll('.nav-item');
    const tabContents = document.querySelectorAll('.tab-content');
    const viewTabs = document.querySelectorAll('.view-tab');
    const forumRender = document.getElementById('forumRender');
    const bbcodeOutput = document.getElementById('bbcodeOutput');
    const copyBtn = document.getElementById('copyBtn');
    const resetAllBtn = document.getElementById('resetAllBtn');

    const obligationsContainer = document.getElementById('obligationsContainer');
    const addObligationBtn = document.getElementById('addObligationBtn');
    const wantedContainer = document.getElementById('wantedContainer');
    const addWantedBtn = document.getElementById('addWantedBtn');
    const factionSelect = document.getElementById('factionSelect');
    const citizenRow = document.getElementById('citizenRow');

    // 3. Переключение разделов в левом меню
    navItems.forEach(btn => {
        btn.addEventListener('click', () => {
            const target = btn.dataset.tab;
            state.currentTab = target;

            navItems.forEach(b => b.classList.remove('active'));
            tabContents.forEach(t => t.classList.remove('active'));

            btn.classList.add('active');
            const targetEl = document.getElementById(`tab-${target}`);
            if (targetEl) targetEl.classList.add('active');

            render();
        });
    });

    // 4. Переключение видов превью (Форум / BBCode)
    viewTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            viewTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            if (tab.dataset.view === 'forum') {
                forumRender.classList.remove('hidden');
                bbcodeOutput.classList.add('hidden');
            } else {
                forumRender.classList.add('hidden');
                bbcodeOutput.classList.remove('hidden');
            }
        });
    });

    // Переключение поля гражданина
    factionSelect.addEventListener('change', () => {
        citizenRow.classList.toggle('hidden', factionSelect.value !== 'Гражданину');
    });

    // 5. Функции форматирования дат и сроков
    function getMoscowDate() {
        const now = new Date();
        const moscowTime = new Date(now.getTime() + (3 * 60 + now.getTimezoneOffset()) * 60000);
        return `${String(moscowTime.getDate()).padStart(2, '0')}.${String(moscowTime.getMonth() + 1).padStart(2, '0')}.${moscowTime.getFullYear()}`;
    }

    function declineTerm(number, word) {
        if (word === 'год') {
            if (number % 10 === 1 && number % 100 !== 11) return 'год';
            if (number % 10 >= 2 && number % 10 <= 4 && (number % 100 < 10 || number % 100 >= 20)) return 'года';
            return 'лет';
        } else if (word === 'месяц') {
            if (number % 10 === 1 && number % 100 !== 11) return 'месяц';
            if (number % 10 >= 2 && number % 10 <= 4 && (number % 100 < 10 || number % 100 >= 20)) return 'месяца';
            return 'месяцев';
        }
        return word;
    }

    function getSupervisorRank(faction) {
        const ranks = {
            'LSPD': 'Шефа', 'LSSD': 'Шерифа', 'SANG': 'Генерала', 'SASPA': 'Директора',
            'FIB': 'Директора', 'GOV': 'Губернатора', 'EMS LS': 'Главного врача',
            'EMS SS': 'Главного врача', 'Гражданин': 'Руководства'
        };
        return ranks[faction] || 'Руководства';
    }

    // 6. Генераторы сырого BBCode
    function buildDecreeBBCode() {
        const d = state.decree;
        const s = state.settings;
        const date = getMoscowDate();

        let sig = s.prosecutorSignature || '';
        if (s.prosecutorSignatureLink.trim()) {
            sig = `[IMG width="350px"]${s.prosecutorSignatureLink.trim()}[/IMG]`;
        }

        let obligationsText = d.obligations.map((item, idx) => {
            const index = idx + 1;
            const role = item.faction === 'Гражданин' ? 'гражданина' : 'сотрудника';

            if (item.type === 'Уведомление') {
                return `[COLOR=rgb(41, 105, 176)]${index}.[/COLOR] [B]Уведомляю ${role} [COLOR=rgb(41, 105, 176)]${item.faction}[/COLOR] [COLOR=rgb(184, 49, 47)]${item.name || '—'}[/COLOR] [№ Паспорта: ${item.passport || '—'}] о начатом досудебном разбирательстве.[/B]`;
            } else if (item.type === 'Боди-Камера') {
                const dateStr = item.date ? new Date(item.date).toLocaleDateString('ru-RU') : '—';
                return `[COLOR=rgb(41, 105, 176)]${index}.[/COLOR] [B]Требую ${role} [COLOR=rgb(41, 105, 176)]${item.faction}[/COLOR] [COLOR=rgb(184, 49, 47)]${item.name || '—'}[/COLOR] [№ Паспорта: ${item.passport || '—'}], предоставить записи с боди-камеры за [COLOR=rgb(184, 49, 47)]${dateStr}[/COLOR] с [COLOR=rgb(184, 49, 47)]${item.timeFrom || '—'}[/COLOR] по [COLOR=rgb(184, 49, 47)]${item.timeTo || '—'}[/COLOR].[/B]`;
            } else if (item.type === 'Запрет на увольнение') {
                return `[COLOR=rgb(41, 105, 176)]${index}.[/COLOR] [B]Уведомляю ${role} [COLOR=rgb(41, 105, 176)]${item.faction}[/COLOR] [COLOR=rgb(184, 49, 47)]${item.name || '—'}[/COLOR] [№ Паспорта: ${item.passport || '—'}] об установленном [COLOR=rgb(184, 49, 47)]запрете на увольнение[/COLOR] на срок 72 часа.[/B]`;
            } else if (item.type === 'Отстранение') {
                const supRank = getSupervisorRank(item.faction);
                return `[COLOR=rgb(41, 105, 176)]${index}.[/COLOR] [B]Обязать [COLOR=rgb(41, 105, 176)]${supRank}[/COLOR] [COLOR=rgb(184, 49, 47)]${item.supervisor || '—'}[/COLOR] отстранить ${role} [COLOR=rgb(41, 105, 176)]${item.faction}[/COLOR] [COLOR=rgb(184, 49, 47)]${item.name || '—'}[/COLOR] [№ Паспорта: ${item.passport || '—'}] и [COLOR=rgb(184, 49, 47)]понизить[/COLOR] его на первый порядковый ранг.[/B]`;
            }
            return '';
        }).join('\n\n');

        if (!obligationsText) obligationsText = '[I]Действия к исполнению не добавлены...[/I]';

        const target = d.factionSelect === 'Гражданину' ? `Гражданину ${d.citizenName || '—'}` : d.factionSelect;

        return `[TABLE width="100%"]
[TR]
[td][IMG width="886px" alt="USMS.png"]https://imgur.com/F9gO8NW.png[/IMG]
[CENTER][IMG width="886px" alt="USMS.png"]https://imgur.com/zQNkkZU.png[/IMG] [B][SIZE=6][COLOR=rgb(41, 105, 176)]ПОСТАНОВЛЕНИЕ MSLR-№${d.orderNumber || '—'}[/COLOR][/SIZE][/B]
Руководствуясь своими полномочиями, предоставленными статьей 2.13 и 2.14 главы V Закона "О United States Marshals Service" и постановлением [COLOR=rgb(184, 49, 47)]${d.judgeRank} ${d.judgeName || '—'}[/COLOR] о принятии искового заявления[COLOR=rgb(184, 49, 47)] №${d.caseId || '—'}[/COLOR] в [COLOR=rgb(255, 255, 255)]${d.courtType} суд[/COLOR] штата Сан-Андреас постановляю: 
Кому: [COLOR=rgb(41, 105, 176)]${target}[/COLOR][IMG width="886px" alt="USMS.png"]https://imgur.com/t7mmvb7.png[/IMG] 

${obligationsText}


[IMG width="886px" alt="USMS.png"]https://imgur.com/t7mmvb7.png[/IMG]
[B][COLOR=rgb(184, 49, 47)]1.[/COLOR] В случае невозможности исполнения какого-либо из пунктов настоящего постановления соответствующее уведомление с указанием причин направить на указанную ниже почту;

[COLOR=rgb(184, 49, 47)]2.[/COLOR] Доказательства исполнения предоставить на указанную ниже почту; 

[COLOR=rgb(184, 49, 47)]3.[/COLOR] Адрес электронной почты Службы Маршалов: ${s.prosecutorDiscord || '—'}

[COLOR=rgb(184, 49, 47)]4.[/COLOR] Постановление вступает в законную силу с момента публикации.

[COLOR=rgb(184, 49, 47)]5.[/COLOR] Срок исполнения постановления установить равным 24 часам. [/B] [IMG width="886px" alt="USMS.png"]https://imgur.com/T0zf5dm.png[/IMG][/CENTER]
[RIGHT][B]    Директор USMS
${s.prosecutorPosition || '—'} 
 Дата: ${date}[/B]
${s.prosecutorName || '—'}
${sig}[/RIGHT]
[/TR]
[/TABLE]`;
    }

    function buildWantedBBCode() {
        const w = state.wanted;
        const s = state.settings;
        const date = getMoscowDate();

        let sig = s.prosecutorSignature || '';
        if (s.prosecutorSignatureLink.trim()) {
            sig = `[IMG width="350px"]${s.prosecutorSignatureLink.trim()}[/IMG]`;
        }

        let wantedText = w.wantedList.map((item, idx) => {
            const index = idx + 1;
            const term = parseInt(item.term) || 0;
            const word = item.verdict === 'УК СА' ? 'год' : 'месяц';
            const termStr = `${term} ${declineTerm(term, word)}`;
            const articleWord = (item.articles && item.articles.includes(',')) ? 'статьям' : 'статье';

            const jailText = item.verdict === 'УК СА'
                ? `[COLOR=rgb(41, 105, 176)]УК СА[/COLOR] и назначить наказание в виде [COLOR=rgb(255, 255, 255)]${termStr}[/COLOR] лишения свободы с отбыванием наказания в [COLOR=rgb(255, 255, 255)]Федеральной Тюрьме Болингброук[/COLOR]`
                : `[COLOR=rgb(41, 105, 176)]АК СА[/COLOR] и назначить наказание в виде [COLOR=rgb(255, 255, 255)]${termStr}[/COLOR] лишения свободы с отбыванием наказания в [COLOR=rgb(255, 255, 255)]Региональном пенитенциарном учреждении[/COLOR]`;

            return `[SIZE=4][B][COLOR=rgb(41, 105, 176)]${index}.[/COLOR] Объявить гражданина США [COLOR=rgb(184, 49, 47)]${item.name || '—'}[/COLOR] [№ Документа ${item.passport || '—'}] в федеральный розыск по [COLOR=rgb(41, 105, 176)]${articleWord} ${item.articles || '—'}[/COLOR] ${jailText}.[/B][/SIZE]`;
        }).join('\n\n');

        if (!wantedText) wantedText = '[I]Разыскиваемые лица не добавлены...[/I]';

        return `[TABLE width="100%"]
[TR]
[td][IMG width="862px" alt="USMS.png"]https://imgur.com/3sEdzED.png[/IMG]
[CENTER][IMG width="886px" alt="USMS.png"]https://imgur.com/3HqLU38.png[/IMG]

[COLOR=rgb(41, 105, 176)][SIZE=6][B]Постановление о федеральном розыске MSFS-${w.orderNumber || '—'}[/B][/SIZE][/COLOR]

[B]Руководствуясь пунктом [B]3 статьи 42 главы X Процессуального кодекса[/B] Штата San Andreas, а так же
на основании постановления [B]${w.judgeRank}[/B] [B][B][COLOR=rgb(184, 49, 47)]${w.judgeName || '—'}[/COLOR][/B][/B] по иску [COLOR=rgb(184, 49, 47)]№${w.caseId || '—'}[/COLOR] ${w.courtType}[/B]

[IMG width="886px" alt="USMS.png"]https://imgur.com/cnQclp4.png[/IMG]


${wantedText}

[IMG width="886px" alt="USMS.png"]https://imgur.com/cnQclp4.png[/IMG]
[SIZE=4][B]Срок: [COLOR=rgb(41, 105, 176)]до исполнения.[/COLOR]
[COLOR=rgb(184, 49, 47)]В бланке ареста в "поле статьи" указать номер постановления.[/COLOR][/B][/SIZE]
[SIZE=5][B][COLOR=rgb(184, 49, 47)][IMG width="886px" alt="USMS.png"]https://imgur.com/AeiYwmY.png[/IMG][/COLOR][/B][/SIZE][/CENTER]
[RIGHT][B]
${s.prosecutorPosition || '—'} 
 Дата: ${date}[/B]
${s.prosecutorName || '—'}
${sig}[/RIGHT]
[/TR]
[/TABLE]`;
    }

    function buildInterrogationBBCode() {
        const inter = state.interrogation;
        return `[CENTER][B][SIZE=5]ПРОТОКОЛ ДОПРОСА[/SIZE][/B]
[B]Допрашиваемый:[/B] ${inter.name || '—'} [№ Паспорта: ${inter.passport || '—'}]
[B]Дата и время:[/B] ${inter.date || '—'} (с ${inter.timeStart || '—'} по ${inter.timeEnd || '—'})
[B]Место проведения:[/B] ${inter.place || '—'}
[B]Присутствующие:[/B] ${inter.present || '—'}

[B]Краткое содержание:[/B]
${inter.summary || '—'}[/CENTER]`;
    }

    // 7. Парсер BBCode в HTML для XenForo (GTA5RP)
    function parseBBCodeToHTML(bbcode) {
        let html = bbcode;
        html = html.replace(/\[B\]([\s\S]*?)\[\/B\]/gi, '<strong>$1</strong>');
        html = html.replace(/\[I\]([\s\S]*?)\[\/I\]/gi, '<em>$1</em>');
        html = html.replace(/\[COLOR=(rgb\([^)]+\)|#[0-9a-fA-F]+)\]([\s\S]*?)\[\/COLOR\]/gi, '<span style="color: $1;">$2</span>');
        html = html.replace(/\[SIZE=([1-7])\]([\s\S]*?)\[\/SIZE\]/gi, (m, size) => {
            const sizes = { '1':'10px', '2':'12px', '3':'14px', '4':'16px', '5':'18px', '6':'24px', '7':'32px' };
            return `<span style="font-size: ${sizes[size] || '14px'};">$2</span>`;
        });
        html = html.replace(/\[CENTER\]([\s\S]*?)\[\/CENTER\]/gi, '<div style="text-align: center;">$1</div>');
        html = html.replace(/\[RIGHT\]([\s\S]*?)\[\/RIGHT\]/gi, '<div style="text-align: right;">$1</div>');
        html = html.replace(/\[IMG width="(.*?)"(?: alt=".*?")?\](.*?)\[\/IMG\]/gi, '<img src="$2" style="max-width: $1; width: 100%;">');
        html = html.replace(/\[IMG\](.*?)\[\/IMG\]/gi, '<img src="$1" style="max-width: 100%;">');
        html = html.replace(/\[TABLE.*?\]([\s\S]*?)\[\/TABLE\]/gi, '<table class="gta-table-container">$1</table>');
        html = html.replace(/\[TR\]([\s\S]*?)\[\/TR\]/gi, '<tr>$1</tr>');
        html = html.replace(/\[td\]([\s\S]*?)\[\/td\]/gi, '<td>$1</td>');
        html = html.replace(/\n/g, '<br>');
        return html;
    }

    // 8. Главный рендер
    function render() {
        let currentCode = '';
        if (state.currentTab === 'wanted') {
            currentCode = buildWantedBBCode();
        } else if (state.currentTab === 'interrogation') {
            currentCode = buildInterrogationBBCode();
        } else {
            currentCode = buildDecreeBBCode();
        }

        bbcodeOutput.value = currentCode;
        forumRender.innerHTML = parseBBCodeToHTML(currentCode);
    }

    // 9. Отрисовка списка действий (Постановление)
    function renderObligationsCards() {
        obligationsContainer.innerHTML = '';
        state.decree.obligations.forEach((item, index) => {
            const card = document.createElement('div');
            card.className = 'item-card';

            let extraInputs = '';
            if (item.type === 'Боди-Камера') {
                extraInputs = `
                    <div class="form-grid">
                        <div class="input-field"><label>Дата</label><input type="date" class="ob-date" value="${item.date || ''}"></div>
                        <div class="input-field"><label>С (время)</label><input type="time" class="ob-time-from" value="${item.timeFrom || ''}"></div>
                        <div class="input-field"><label>По (время)</label><input type="time" class="ob-time-to" value="${item.timeTo || ''}"></div>
                    </div>`;
            } else if (item.type === 'Отстранение') {
                extraInputs = `
                    <div class="input-field"><label>Имя Фамилия руководства</label><input type="text" class="ob-sup" placeholder="Dante DeRosse" value="${item.supervisor || ''}"></div>`;
            }

            card.innerHTML = `
                <div class="item-card-header">
                    <span class="item-card-title">#${index + 1} Действие к исполнению</span>
                    <button class="del-card-btn" title="Удалить">✕</button>
                </div>
                <div class="form-grid">
                    <div class="input-field">
                        <label>Тип действия</label>
                        <select class="ob-type">
                            <option value="Уведомление" ${item.type === 'Уведомление' ? 'selected' : ''}>Уведомление</option>
                            <option value="Боди-Камера" ${item.type === 'Боди-Камера' ? 'selected' : ''}>Боди-Камера</option>
                            <option value="Запрет на увольнение" ${item.type === 'Запрет на увольнение' ? 'selected' : ''}>Запрет на увольнение</option>
                            <option value="Отстранение" ${item.type === 'Отстранение' ? 'selected' : ''}>Отстранение</option>
                        </select>
                    </div>
                    <div class="input-field">
                        <label>Фракция</label>
                        <select class="ob-faction">
                            ${['LSPD', 'LSSD', 'SANG', 'SASPA', 'FIB', 'GOV', 'EMS LS', 'EMS SS', 'Гражданин'].map(f => `<option value="${f}" ${item.faction === f ? 'selected' : ''}>${f}</option>`).join('')}
                        </select>
                    </div>
                    <div class="input-field">
                        <label>Имя Фамилия</label>
                        <input type="text" class="ob-name" placeholder="Dante DeRosse" value="${item.name || ''}">
                    </div>
                    <div class="input-field">
                        <label>Паспорт</label>
                        <input type="text" class="ob-pass" placeholder="380938" value="${item.passport || ''}">
                    </div>
                </div>
                ${extraInputs}
            `;

            // Слушатели на поля карточки
            card.querySelector('.del-card-btn').addEventListener('click', () => {
                state.decree.obligations.splice(index, 1);
                renderObligationsCards();
                render();
            });

            card.querySelector('.ob-type').addEventListener('change', (e) => {
                state.decree.obligations[index].type = e.target.value;
                renderObligationsCards();
                render();
            });

            card.querySelector('.ob-faction').addEventListener('change', (e) => {
                state.decree.obligations[index].faction = e.target.value;
                render();
            });

            card.querySelector('.ob-name').addEventListener('input', (e) => {
                state.decree.obligations[index].name = e.target.value;
                render();
            });

            card.querySelector('.ob-pass').addEventListener('input', (e) => {
                state.decree.obligations[index].passport = e.target.value;
                render();
            });

            if (item.type === 'Боди-Камера') {
                card.querySelector('.ob-date').addEventListener('change', (e) => { state.decree.obligations[index].date = e.target.value; render(); });
                card.querySelector('.ob-time-from').addEventListener('input', (e) => { state.decree.obligations[index].timeFrom = e.target.value; render(); });
                card.querySelector('.ob-time-to').addEventListener('input', (e) => { state.decree.obligations[index].timeTo = e.target.value; render(); });
            } else if (item.type === 'Отстранение') {
                card.querySelector('.ob-sup').addEventListener('input', (e) => { state.decree.obligations[index].supervisor = e.target.value; render(); });
            }

            obligationsContainer.appendChild(card);
        });
    }

    addObligationBtn.addEventListener('click', () => {
        state.decree.obligations.push({
            type: 'Уведомление',
            faction: 'LSPD',
            name: '',
            passport: ''
        });
        renderObligationsCards();
        render();
    });

    // 10. Отрисовка списка разыскиваемых (Розыск)
    function renderWantedCards() {
        wantedContainer.innerHTML = '';
        state.wanted.wantedList.forEach((item, index) => {
            const card = document.createElement('div');
            card.className = 'item-card';

            card.innerHTML = `
                <div class="item-card-header">
                    <span class="item-card-title">#${index + 1} Разыскиваемый</span>
                    <button class="del-card-btn" title="Удалить">✕</button>
                </div>
                <div class="form-grid">
                    <div class="input-field">
                        <label>Имя Фамилия</label>
                        <input type="text" class="w-name" placeholder="Имя Фамилия" value="${item.name || ''}">
                    </div>
                    <div class="input-field">
                        <label>Паспорт</label>
                        <input type="text" class="w-pass" placeholder="серия номер" value="${item.passport || ''}">
                    </div>
                    <div class="input-field">
                        <label>Статьи обвинения</label>
                        <input type="text" class="w-articles" placeholder="ст. 105, ст. 158" value="${item.articles || ''}">
                    </div>
                    <div class="input-field">
                        <label>Вид кодекса</label>
                        <select class="w-verdict">
                            <option value="УК СА" ${item.verdict === 'УК СА' ? 'selected' : ''}>УК СА</option>
                            <option value="АК СА" ${item.verdict === 'АК СА' ? 'selected' : ''}>АК СА</option>
                        </select>
                    </div>
                    <div class="input-field full-width">
                        <label>Срок лишения свободы</label>
                        <input type="number" class="w-term" placeholder="Срок (числом)" min="1" value="${item.term || ''}">
                    </div>
                </div>
            `;

            card.querySelector('.del-card-btn').addEventListener('click', () => {
                state.wanted.wantedList.splice(index, 1);
                renderWantedCards();
                render();
            });

            card.querySelector('.w-name').addEventListener('input', (e) => { state.wanted.wantedList[index].name = e.target.value; render(); });
            card.querySelector('.w-pass').addEventListener('input', (e) => { state.wanted.wantedList[index].passport = e.target.value; render(); });
            card.querySelector('.w-articles').addEventListener('input', (e) => { state.wanted.wantedList[index].articles = e.target.value; render(); });
            card.querySelector('.w-verdict').addEventListener('change', (e) => { state.wanted.wantedList[index].verdict = e.target.value; render(); });
            card.querySelector('.w-term').addEventListener('input', (e) => { state.wanted.wantedList[index].term = e.target.value; render(); });

            wantedContainer.appendChild(card);
        });
    }

    addWantedBtn.addEventListener('click', () => {
        state.wanted.wantedList.push({
            name: '',
            passport: '',
            articles: '',
            verdict: 'УК СА',
            term: ''
        });
        renderWantedCards();
        render();
    });

    // 11. Синхронизация статичных полей
    const bindInput = (id, obj, prop) => {
        const el = document.getElementById(id);
        if (el) {
            el.addEventListener('input', (e) => {
                obj[prop] = e.target.value;
                render();
            });
        }
    };

    // Постановление
    bindInput('orderNumber', state.decree, 'orderNumber');
    bindInput('caseId', state.decree, 'caseId');
    bindInput('judgeName', state.decree, 'judgeName');
    bindInput('judgeRank', state.decree, 'judgeRank');
    bindInput('courtType', state.decree, 'courtType');
    bindInput('factionSelect', state.decree, 'factionSelect');
    bindInput('citizenName', state.decree, 'citizenName');

    // Допрос
    bindInput('interrogationName', state.interrogation, 'name');
    bindInput('interrogationPassport', state.interrogation, 'passport');
    bindInput('interrogationDate', state.interrogation, 'date');
    bindInput('interrogationTimeStart', state.interrogation, 'timeStart');
    bindInput('interrogationTimeEnd', state.interrogation, 'timeEnd');
    bindInput('interrogationPlace', state.interrogation, 'place');
    bindInput('interrogationPresent', state.interrogation, 'present');
    bindInput('interrogationSummary', state.interrogation, 'summary');

    // Розыск
    bindInput('wantedOrderNumber', state.wanted, 'orderNumber');
    bindInput('wantedCaseId', state.wanted, 'caseId');
    bindInput('wantedJudgeName', state.wanted, 'judgeName');
    bindInput('wantedJudgeRank', state.wanted, 'judgeRank');
    bindInput('wantedCourtType', state.wanted, 'courtType');

    // Настройки
    bindInput('prosecutorPosition', state.settings, 'prosecutorPosition');
    bindInput('prosecutorName', state.settings, 'prosecutorName');
    bindInput('prosecutorDiscord', state.settings, 'prosecutorDiscord');
    bindInput('prosecutorSignature', state.settings, 'prosecutorSignature');
    bindInput('prosecutorSignatureLink', state.settings, 'prosecutorSignatureLink');

    // 12. Копирование и Сброс
    copyBtn.addEventListener('click', async () => {
        try {
            await navigator.clipboard.writeText(bbcodeOutput.value);
            const origText = copyBtn.innerText;
            copyBtn.innerText = '✅ Скопировано!';
            copyBtn.style.background = '#2ea043';
            setTimeout(() => {
                copyBtn.innerText = origText;
                copyBtn.style.background = 'var(--success)';
            }, 1800);
        } catch (e) {
            alert('Не удалось скопировать текст');
        }
    });

    resetAllBtn.addEventListener('click', () => {
        if (!confirm('Вы уверены, что хотите сбросить все введенные данные?')) return;
        document.querySelectorAll('input:not([type="button"]):not([type="submit"]), textarea').forEach(i => i.value = '');
        state.decree.obligations = [];
        state.wanted.wantedList = [];
        renderObligationsCards();
        renderWantedCards();
        render();
    });

    // Стартовая инициализация
    render();
});
