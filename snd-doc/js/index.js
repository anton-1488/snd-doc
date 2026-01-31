document.addEventListener('DOMContentLoaded', function() {
loadPage("https://anton-1488.github.io/snd-doc/snd-doc/docs/index.html");

function addCopyButtons() {
        const codeExamples = document.querySelectorAll('.code-example');

        codeExamples.forEach(example => {
            // Ищем заголовок или создаём новый
            let header = example.querySelector('.code-header');
            if (!header) {
                const codeElement = example.querySelector('pre code');
                const language = codeElement ? codeElement.className.replace('language-', '') : 'code';

                header = document.createElement('div');
                header.className = 'code-header';
                header.innerHTML = `
                    <span>${language.toUpperCase()}</span>
                    <button class="copy-btn">
                        <span class="copy-icon"></span>
                        Копировать
                    </button>
                `;

                example.insertBefore(header, example.firstChild);
            } else {
                // Если заголовок уже есть, добавляем кнопку
                if (!header.querySelector('.copy-btn')) {
                    const copyBtn = document.createElement('button');
                    copyBtn.className = 'copy-btn';
                    copyBtn.innerHTML = `
                        <span class="copy-icon"></span>
                        Копировать
                    `;
                    header.appendChild(copyBtn);
                }
            }

            // Вешаем обработчик на кнопку копирования
            const copyBtn = header.querySelector('.copy-btn');
            const codeElement = example.querySelector('pre code');

            if (copyBtn && codeElement) {
                copyBtn.addEventListener('click', function() {
                    copyToClipboard(codeElement.textContent, this);
                });
            }
        });
    }

    // Функция копирования в буфер обмена
    function copyToClipboard(text, button) {
        // Используем современный Clipboard API
        navigator.clipboard.writeText(text).then(() => {
            // Визуальный фидбек
            const originalText = button.innerHTML;
            button.innerHTML = '<span class="copy-icon"></span>Скопировано!';
            button.classList.add('copied');

            // Возвращаем исходный текст через 2 секунды
            setTimeout(() => {
                button.innerHTML = originalText;
                button.classList.remove('copied');
            }, 2000);
        }).catch(err => {
            // Fallback для старых браузеров
            console.error('Failed to copy: ', err);

            // Старый метод
            const textArea = document.createElement('textarea');
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();

            try {
                document.execCommand('copy');
                // Визуальный фидбек
                const originalText = button.innerHTML;
                button.innerHTML = '<span class="copy-icon"></span>Скопировано!';
                button.classList.add('copied');

                setTimeout(() => {
                    button.innerHTML = originalText;
                    button.classList.remove('copied');
                }, 2000);
            } catch (err) {
                console.error('Fallback copy failed: ', err);
                button.innerHTML = '<span class="copy-icon"></span>Ошибка';
            }

            document.body.removeChild(textArea);
        });
    }

const contentDiv = document.getElementById('content');

function loadPage(url) {
    fetch(url)
        .then(response => {
            if (!response.ok) throw new Error("Failed to load page");
            return response.text();
        })
        .then(html => {
            contentDiv.innerHTML = html;
            Prism.highlightAll();
            addCopyButtons();
        })
        .catch(err => {
            console.log("Error to load page");
        });
}

// Вешаем обработчик на все ссылки меню
document.querySelectorAll('.menu-link').forEach(link => {
    link.addEventListener('click', e => {
        const url = link.getAttribute('href');
        e.preventDefault();
        console.log("Executing link lick");
        loadPage(url);
    });
});

// Обрабатываем кнопку "назад/вперед" в браузере
window.addEventListener('popstate', e => {
    if (e.state && e.state.page) {
        loadPage(e.state.page);
    }
});

    // Инициализируем подсветку кода
    if (typeof Prism !== 'undefined') {
        Prism.highlightAll();
    }
});