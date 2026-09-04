document.addEventListener('DOMContentLoaded', () => {
    // 1. Состояние приложения (State)
    const state = {
        settings: {
            prosecutorPosition: 'Директор USMS',
            prosecutorName: 'Dante DeRosse',
            prosecutorDiscord: '.dantezzz',
            signatureLink: 'https://i.imgur.com/YOUR_SIG.png' // Замените на свою
        },
        decree: {
            orderNum: '600',
            caseNum: '',
            courtType: 'окружной',
            judgeName: '',
            judgeRank: 'окружного судьи',
            targetFaction: 'LSPD',
            actions: [] // Массив действий
        }
    };

    // 2. DOM Элементы
    const formInputs = document.querySelectorAll('.form-group-grid input, .form-group-grid select');
    const actionsList = document.getElementById('actionsList');
    const addActionBtn = document.getElementById('addActionBtn');
    const bbcodeOutput = document.getElementById('bbcodeOutput');
    const forumRender = document.getElementById('forumRender');
    const copyBtn = document.getElementById('copyBtn');

    // Переключение вкладок превью
    document.querySelectorAll('.view-tab').forEach(tab => {
        tab.addEventListener('click', (e) => {
            document.querySelectorAll('.view-tab').forEach(t => t.classList.remove('active'));
            e.target.classList.add('active');
            
            if (e.target.dataset.view === 'forum') {
                forumRender.classList.remove('hidden');
                bbcodeOutput.classList.add('hidden');
            } else {
                forumRender.classList.add('hidden');
                bbcodeOutput.classList.remove('hidden');
            }
        });
    });

    // 3. Формирование сырого BBCode
    function generateBBCode() {
        const d = state.decree;
        const s = state.settings;
        const date = new Date().toLocaleDateString('ru-RU');

        // Генерация списка действий
        let actionsBBCode = d.actions.map((act, index) => {
            return `[COLOR=rgb(41, 105, 176)]${index + 1}.[/COLOR] [B]Уведомляю сотрудника [COLOR=rgb(41, 105, 176)]${act.faction}[/COLOR] [COLOR=rgb(184, 49, 47)]${act.name}[/COLOR] [№ Паспорта: ${act.passport}] о выполнении процессуальных действий.[/B]`;
        }).join('\n\n');

        if (!actionsBBCode) actionsBBCode = '[I]Действия не добавлены...[/I]';

        return `[TABLE width="100%"]
[TR]
[td][IMG width="886px"]https://imgur.com/F9gO8NW.png[/IMG]
[CENTER][IMG width="886px"]https://imgur.com/zQNkkZU.png[/IMG]

[B][SIZE=6][COLOR=rgb(41, 105, 176)]ПОСТАНОВЛЕНИЕ MSLR-№${d.orderNum}[/COLOR][/SIZE][/B]
[B]Руководствуясь полномочиями Закона "О USMS" и постановлением [COLOR=rgb(184, 49, 47)]${d.judgeRank} ${d.judgeName}[/COLOR] по иску [COLOR=rgb(184, 49, 47)]№${d.caseNum}[/COLOR] в [COLOR=rgb(255, 255, 255)]${d.courtType} суд[/COLOR] постановляю:[/B] 
[B]Кому: [COLOR=rgb(41, 105, 176)]${d.targetFaction}[/COLOR][/B]

[IMG width="886px"]https://imgur.com/t7mmvb7.png[/IMG] 

${actionsBBCode}

[IMG width="886px"]https://imgur.com/t7mmvb7.png[/IMG]
[B][COLOR=rgb(184, 49, 47)]1.[/COLOR] Доказательства исполнения предоставить на почту: ${s.prosecutorDiscord}[/B]
[B][COLOR=rgb(184, 49, 47)]2.[/COLOR] Срок исполнения постановления установить равным 24 часам.[/B]
[IMG width="886px"]https://imgur.com/T0zf5dm.png[/IMG][/CENTER]
[RIGHT][B]${s.prosecutorPosition}
Дата: ${date}[/B]
${s.prosecutorName}
[IMG width="250px"]${s.signatureLink}[/IMG][/RIGHT][/td]
[/TR]
[/TABLE]`;
    }

    // 4. Парсер BBCode в HTML для Форума GTA5RP
    function parseBBCodeToHTML(bbcode) {
        let html = bbcode;
        
        // Базовые теги
        html = html.replace(/\[B\]([\s\S]*?)\[\/B\]/gi, '<strong>$1</strong>');
        html = html.replace(/\[I\]([\s\S]*?)\[\/I\]/gi, '<em>$1</em>');
        
        // Цвета (rgb или hex)
        html = html.replace(/\[COLOR=(rgb\([^)]+\)|#[0-9a-fA-F]+)\]([\s\S]*?)\[\/COLOR\]/gi, '<span style="color: $1;">$2</span>');
        
        // Размеры (на форумах размер 6 обычно равен около 24px)
        html = html.replace(/\[SIZE=6\]([\s\S]*?)\[\/SIZE\]/gi, '<span style="font-size: 24px;">$1</span>');
        
        // Выравнивание
        html = html.replace(/\[CENTER\]([\s\S]*?)\[\/CENTER\]/gi, '<div style="text-align: center;">$1</div>');
        html = html.replace(/\[RIGHT\]([\s\S]*?)\[\/RIGHT\]/gi, '<div style="text-align: right;">$1</div>');
        
        // Изображения (с width)
        html = html.replace(/\[IMG width="(.*?)"(?: alt=".*?")?\](.*?)\[\/IMG\]/gi, '<img src="$2" style="max-width: $1; width: 100%;">');
        html = html.replace(/\[IMG\](.*?)\[\/IMG\]/gi, '<img src="$1" style="max-width: 100%;">');
        
        // Таблицы
        html = html.replace(/\[TABLE.*?\]([\s\S]*?)\[\/TABLE\]/gi, '<table class="gta-table-container">$1</table>');
        html = html.replace(/\[TR\]([\s\S]*?)\[\/TR\]/gi, '<tr>$1</tr>');
        html = html.replace(/\[td\]([\s\S]*?)\[\/td\]/gi, '<td>$1</td>');
        
        // Переносы строк
        html = html.replace(/\n/g, '<br>');
        
        return html;
    }

    // 5. Рендер (Обновление интерфейса)
    function render() {
        const bbcode = generateBBCode();
        bbcodeOutput.value = bbcode;
        forumRender.innerHTML = parseBBCodeToHTML(bbcode);
    }

    // 6. Слушатели событий формы
    formInputs.forEach(input => {
        input.addEventListener('input', (e) => {
            state.decree[e.target.id] = e.target.value;
            render();
        });
    });

    // 7. Добавление динамического действия
    addActionBtn.addEventListener('click', () => {
        const action = { type: 'Уведомление', faction: 'LSPD', name: '', passport: '' };
        state.decree.actions.push(action);
        
        const actionIndex = state.decree.actions.length - 1;
        const card = document.createElement('div');
        card.className = 'action-card';
        card.innerHTML = `
            <button class="delete-btn">✕</button>
            <div class="input-field" style="margin-bottom:8px;">
                <label>Имя Фамилия</label>
                <input type="text" class="act-name" placeholder="John Doe">
            </div>
            <div class="input-field">
                <label>Паспорт</label>
                <input type="text" class="act-pass" placeholder="123456">
            </div>
        `;

        // Удаление карточки
        card.querySelector('.delete-btn').addEventListener('click', () => {
            state.decree.actions.splice(actionIndex, 1);
            card.remove();
            render();
        });

        // Обновление стейта при вводе
        card.querySelector('.act-name').addEventListener('input', (e) => {
            state.decree.actions[actionIndex].name = e.target.value;
            render();
        });
        card.querySelector('.act-pass').addEventListener('input', (e) => {
            state.decree.actions[actionIndex].passport = e.target.value;
            render();
        });

        actionsList.appendChild(card);
        render();
    });

    // Копирование
    copyBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(bbcodeOutput.value);
        copyBtn.textContent = 'Скопировано!';
        copyBtn.style.background = '#059669';
        setTimeout(() => {
            copyBtn.textContent = 'Скопировать код';
            copyBtn.style.background = 'var(--success)';
        }, 2000);
    });

    // Первичный рендер
    render();
});
