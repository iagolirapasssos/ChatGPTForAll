document.addEventListener('DOMContentLoaded', () => {
    const themeSwitch = document.getElementById('theme-switch');
    const optionsBtn = document.getElementById('options-btn');
    const optionsModal = document.getElementById('options-modal');
    const closeModal = document.getElementById('close-modal');
    const saveConfig = document.getElementById('save-config');
    const apiKeyInput = document.getElementById('api-key');
    const promptForm = document.getElementById('prompt-form');
    const promptInput = document.getElementById('prompt-input');
    const chatContainer = document.getElementById('chat-container');
    const imageContainer = document.getElementById('image-container');
    const imagePromptInput = document.getElementById('image-prompt');
    const modeSwitch = document.getElementById('mode-switch');
    const systemRole = document.getElementById('system-role');

    const maxTokens = document.getElementById('max-tokens');
    const temperature = document.getElementById('temperature');
    const topP = document.getElementById('top-p');
    const frequencyPenalty = document.getElementById('frequency-penalty');
    const presencePenalty = document.getElementById('presence-penalty');

    const temperatureValue = document.getElementById('temperature-value');
    const topPValue = document.getElementById('top-p-value');
    const frequencyPenaltyValue = document.getElementById('frequency-penalty-value');
    const presencePenaltyValue = document.getElementById('presence-penalty-value');
	const languageSelect = document.getElementById('language-select');
	
    const loadingModal = document.getElementById('loading-modal');
    
    const copyMarkdownBtn = document.getElementById('copy-markdown');
    const downloadTxtBtn = document.getElementById('download-txt');
    let currentMarkdownContent = '';
    
    const imageOptions = document.getElementById('image-options');
    const textOptions = document.getElementById('text-options');
    
    const translations = {
		en: {
		    title: "ChatAIForAll",
		    settings: "Settings",
		    apiKeyLabel: "OpenAI API Key:",
		    systemRoleLabel: "System Role:",
		    maxTokensLabel: "Max Tokens:",
		    temperatureLabel: "Temperature:",
		    topPLabel: "Top P:",
		    frequencyPenaltyLabel: "Frequency Penalty:",
		    presencePenaltyLabel: "Presence Penalty:",
		    save: "Save",
		    close: "Close",
		    languageLabel: "Language:"
		},
		pt: {
		    title: "ChatAIParaTodos",
		    settings: "Configurações",
		    apiKeyLabel: "Chave da API OpenAI:",
		    systemRoleLabel: "Função do Sistema:",
		    maxTokensLabel: "Máximo de Tokens:",
		    temperatureLabel: "Temperatura:",
		    topPLabel: "Top P:",
		    frequencyPenaltyLabel: "Penalidade de Frequência:",
		    presencePenaltyLabel: "Penalidade de Presença:",
		    save: "Salvar",
		    close: "Fechar",
		    languageLabel: "Idioma:"
		},
		es: {
		    title: "ChatAIParaTodos",
		    settings: "Configuraciones",
		    apiKeyLabel: "Clave API de OpenAI:",
		    systemRoleLabel: "Rol del Sistema:",
		    maxTokensLabel: "Máx. de Tokens:",
		    temperatureLabel: "Temperatura:",
		    topPLabel: "Top P:",
		    frequencyPenaltyLabel: "Penalización por Frecuencia:",
		    presencePenaltyLabel: "Penalización por Presencia:",
		    save: "Guardar",
		    close: "Cerrar",
		    languageLabel: "Idioma:"
		}
	};
    
    function updateModeOptions() {
        if (modeSwitch.checked) {
            imageOptions.classList.remove('hidden');
            textOptions.classList.add('hidden');
        } else {
            imageOptions.classList.add('hidden');
            textOptions.classList.remove('hidden');
        }
    }

    function generateEncryptionKey() {
        const array = new Uint8Array(32);
        crypto.getRandomValues(array);
        return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
    }

    function getEncryptionKey() {
        let key = localStorage.getItem('encryption-key');
        if (!key) {
            key = generateEncryptionKey();
            localStorage.setItem('encryption-key', key);
        }
        return key;
    }

    function encrypt(text, key) {
        return btoa(text.split('').map((char, index) => 
            String.fromCharCode(char.charCodeAt(0) ^ key.charCodeAt(index % key.length))
        ).join(''));
    }

    function decrypt(encoded, key) {
        return atob(encoded).split('').map((char, index) => 
            String.fromCharCode(char.charCodeAt(0) ^ key.charCodeAt(index % key.length))
        ).join('');
    }

    function markdownToHtml(markdown) {
        const converter = new showdown.Converter();
        return converter.makeHtml(markdown);
    }

    function updateDisplayedValues() {
		document.getElementById('temperature-value').textContent = temperature.value;
		document.getElementById('top-p-value').textContent = topP.value;
		document.getElementById('frequency-penalty-value').textContent = frequencyPenalty.value;
		document.getElementById('presence-penalty-value').textContent = presencePenalty.value;
	}
	
	function updateLanguage(lang) {
		document.title = translations[lang].title;
		document.getElementById('app-title').textContent = translations[lang].title;
		document.getElementById('settings-title').textContent = translations[lang].settings;
		document.getElementById('api-key-label').textContent = translations[lang].apiKeyLabel;
		document.getElementById('system-role-label').textContent = translations[lang].systemRoleLabel;
		document.getElementById('max-tokens-label').textContent = translations[lang].maxTokensLabel;
		document.getElementById('temperature-label').textContent = translations[lang].temperatureLabel;
		document.getElementById('top-p-label').textContent = translations[lang].topPLabel;
		document.getElementById('frequency-penalty-label').textContent = translations[lang].frequencyPenaltyLabel;
		document.getElementById('presence-penalty-label').textContent = translations[lang].presencePenaltyLabel;
		document.getElementById('language-label').textContent = translations[lang].languageLabel;
		saveConfig.textContent = translations[lang].save;
		closeModal.textContent = translations[lang].close;
	}

    function saveConfiguration() { 
		const config = {
		    apiKey: apiKeyInput.value,
		    systemRole: systemRole.value,
		    maxTokens: maxTokens.value,
		    temperature: temperature.value,
		    topP: topP.value,
		    frequencyPenalty: frequencyPenalty.value,
		    presencePenalty: presencePenalty.value,
		    language: languageSelect.value
		};

		const encryptionKey = getEncryptionKey();
		const encryptedConfig = encrypt(JSON.stringify(config), encryptionKey);
		localStorage.setItem('chat-config', encryptedConfig);

		updateLanguage(config.language);
	}

    function loadConfiguration() {
		const encryptedConfig = localStorage.getItem('chat-config');
		if (encryptedConfig) {
		    const encryptionKey = getEncryptionKey();
		    try {
		        const config = JSON.parse(decrypt(encryptedConfig, encryptionKey));

		        apiKeyInput.value = config.apiKey;
		        systemRole.value = config.systemRole;
		        maxTokens.value = config.maxTokens;
		        temperature.value = config.temperature;
		        topP.value = config.topP;
		        frequencyPenalty.value = config.frequencyPenalty;
		        presencePenalty.value = config.presencePenalty;
		        languageSelect.value = config.language || 'en';

		        updateLanguage(config.language || 'en');
		        updateDisplayedValues();
		    } catch (error) {
		        console.error('Erro ao carregar configuração:', error);
		        alert('Erro ao carregar configuração. Verifique os dados armazenados.');
		    }
		}
	}

    function showLoadingModal() {
        loadingModal.classList.remove('hidden');
    }

    function hideLoadingModal() {
        loadingModal.classList.add('hidden');
    }

    function displayGeneratedImages(urls) {
        urls.forEach(url => {
            const img = document.createElement('img');
            img.src = url;
            img.alt = 'Imagem gerada';

            // Adiciona a imagem ao contêiner de chat
            const imageMessage = document.createElement('div');
            imageMessage.classList.add('message', 'ai-message');
            imageMessage.appendChild(img);
            chatContainer.appendChild(imageMessage);
            chatContainer.scrollTop = chatContainer.scrollHeight;
        });
    }

    async function fetchImage(prompt) {
        const apiKey = decrypt(localStorage.getItem('openai-api-key'), getEncryptionKey());

        const data = {
            model: 'dall-e-3',
            prompt: prompt,
            n: 1, // Número de imagens
            size: "1024x1024" // Tamanho desejado
        };

        try {
            const response = await fetch('https://api.openai.com/v1/images/generations', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                const json = await response.json();
                const imageUrls = json.data.map(item => item.url); // Extrair URLs de imagens
                displayGeneratedImages(imageUrls);
            } else {
                const errorText = await response.text();
                throw new Error(`Erro ao gerar imagem: ${errorText}`);
            }
        } catch (error) {
            const errorMessage = document.createElement('div');
            errorMessage.classList.add('message', 'error-message');
            errorMessage.textContent = `Erro: ${error.message}`;
            chatContainer.appendChild(errorMessage);
            chatContainer.scrollTop = chatContainer.scrollHeight;
            console.error('Erro ao gerar imagem:', error);
        } finally {
            hideLoadingModal();
        }
    }

    async function fetchResponse(prompt) {
		const apiKey = decrypt(localStorage.getItem('openai-api-key'), getEncryptionKey());
		const config = JSON.parse(decrypt(localStorage.getItem('chat-config'), getEncryptionKey()));

		const data = {
		    model: textOptions.value || 'gpt-4o',
		    messages: [
		        { role: "system", content: systemRole.value || "You are an assistant." },
		        { role: "user", content: prompt }
		    ],
		    max_tokens: parseInt(config.maxTokens, 10),
		    temperature: parseFloat(config.temperature),
		    top_p: parseFloat(config.topP),
		    frequency_penalty: parseFloat(config.frequencyPenalty),
		    presence_penalty: parseFloat(config.presencePenalty)
		};

		try {
		    const response = await fetch('https://api.openai.com/v1/chat/completions', {
		        method: 'POST',
		        headers: {
		            'Content-Type': 'application/json',
		            'Authorization': `Bearer ${apiKey}`
		        },
		        body: JSON.stringify(data)
		    });

		    if (response.ok) {
		        const json = await response.json();
		        const responseContent = json.choices[0].message.content.trim();
		        currentMarkdownContent = responseContent;
		        return responseContent;
		    } else {
		        const errorText = await response.text();
		        throw new Error(`Erro ao buscar resposta da API: ${errorText}`);
		    }
		} catch (error) {
		    console.error('Erro ao buscar resposta da API:', error);
		    const errorMessage = document.createElement('div');
		    errorMessage.classList.add('message', 'error-message');
		    errorMessage.textContent = `Erro: ${error.message}`;
		    chatContainer.appendChild(errorMessage);
		    chatContainer.scrollTop = chatContainer.scrollHeight;
		}
	}


    function handleCopyMarkdown() {
        navigator.clipboard.writeText(currentMarkdownContent).then(() => {
            alert('Conteúdo copiado como Markdown!');
        }).catch(err => {
            alert('Falha ao copiar: ' + err);
            console.error('Erro ao copiar para o clipboard:', err);
        });
    }

    function handleDownloadTxt() {
        const blob = new Blob([currentMarkdownContent], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'conteudo.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    function handleSubmit() {
		const prompt = promptInput.value.trim();
		if (prompt) {
		    const userMessage = document.createElement('div');
		    userMessage.classList.add('message', 'user-message');
		    userMessage.textContent = prompt;

		    // Criar botões para copiar e baixar
		    const userButtons = document.createElement('div');
		    userButtons.classList.add('message-buttons');
		    userButtons.innerHTML = `
		        <button class="copy-markdown-btn" title="Copiar Markdown"><i class="fas fa-copy"></i></button>
		        <button class="download-txt-btn" title="Baixar como .txt"><i class="fas fa-download"></i></button>
		    `;
		    userMessage.appendChild(userButtons);

		    chatContainer.appendChild(userMessage);
		    chatContainer.scrollTop = chatContainer.scrollHeight;

		    showLoadingModal();

		    if (modeSwitch.checked) {
		        // Modo de geração de imagem
		        fetchImage(prompt);
		    } else {
		        // Modo de geração de texto
		        fetchResponse(prompt).then(responseContent => {
		            const botMessage = document.createElement('div');
		            botMessage.classList.add('message', 'bot-message');
		            botMessage.innerHTML = markdownToHtml(responseContent);

		            // Criar botões para copiar e baixar
		            const responseButtons = document.createElement('div');
		            responseButtons.classList.add('message-buttons');
		            responseButtons.innerHTML = `
		                <button class="copy-markdown-btn" title="Copiar Markdown"><i class="fas fa-copy"></i></button>
		                <button class="download-txt-btn" title="Baixar como .txt"><i class="fas fa-download"></i></button>
		            `;
		            botMessage.appendChild(responseButtons);

		            chatContainer.appendChild(botMessage);
		            chatContainer.scrollTop = chatContainer.scrollHeight;

		            // Highlight syntax
		            document.querySelectorAll('pre code').forEach((block) => {
		                hljs.highlightElement(block);
		            });

		            currentMarkdownContent = responseContent; // Armazenar o conteúdo em Markdown
		            hideLoadingModal();
		        }).catch(error => {
		            const errorMessage = document.createElement('div');
		            errorMessage.classList.add('message', 'error-message');
		            errorMessage.textContent = `Erro: ${error.message}`;
		            chatContainer.appendChild(errorMessage);
		            chatContainer.scrollTop = chatContainer.scrollHeight;
		            hideLoadingModal();
		        });
		    }
		    promptInput.value = ''; // Limpar o input após enviar
		}
	}
	
	// Adicione este event listener para lidar com os cliques nos botões de copiar e baixar
	chatContainer.addEventListener('click', (event) => {
        if (event.target.closest('.copy-markdown-btn')) {
            handleCopyMarkdown();
        }

        if (event.target.closest('.download-txt-btn')) {
            handleDownloadTxt();
        }
    });

    function toggleDarkMode() {
		document.body.classList.toggle('dark-theme');
		localStorage.setItem('dark-mode', document.body.classList.contains('dark-theme'));
	}
	
	function loadThemePreference() {
		const darkMode = localStorage.getItem('dark-mode');
		if (darkMode === 'true') {
		    document.body.classList.add('dark-theme');
		    themeSwitch.checked = true;
		}
	}
	
	loadThemePreference();
    themeSwitch.addEventListener('change', toggleDarkMode);

    optionsBtn.addEventListener('click', () => {
        optionsModal.classList.remove('hidden');
    });

    closeModal.addEventListener('click', () => {
        optionsModal.style.display = 'none';
    });
	
    optionsBtn.addEventListener('click', () => {
        loadConfiguration();
        optionsModal.style.display = 'block';
        apiKeyInput.value = localStorage.getItem('openai-api-key') ? '*'.repeat(20) : '';
    });

    window.addEventListener('click', (event) => {
        if (event.target === optionsModal) {
            optionsModal.style.display = 'none';
        }
    });
    
     saveConfig.addEventListener('click', () => {
        const apiKey = apiKeyInput.value.trim();
        if (apiKey && apiKey !== '*'.repeat(apiKey.length)) {
            const encryptionKey = getEncryptionKey();
            const encryptedKey = encrypt(apiKey, encryptionKey);
            localStorage.setItem('openai-api-key', encryptedKey);
        }
        saveConfiguration();
        alert('Configurações salvas com sucesso!');
        optionsModal.style.display = 'none';
    });
    
    temperature.addEventListener('input', updateDisplayedValues);
    topP.addEventListener('input', updateDisplayedValues);
    frequencyPenalty.addEventListener('input', updateDisplayedValues);
    presencePenalty.addEventListener('input', updateDisplayedValues);

    promptForm.addEventListener('submit', (event) => {
        event.preventDefault();
        handleSubmit();
    });

    //copyMarkdownBtn.addEventListener('click', handleCopyMarkdown);
    //downloadTxtBtn.addEventListener('click', handleDownloadTxt);

    modeSwitch.addEventListener('change', () => {
        /*if (modeSwitch.checked) {
            chatContainer.style.display = 'none';
            imageContainer.style.display = 'block';
        } else {
            chatContainer.style.display = 'block';
            imageContainer.style.display = 'none';
        }*/
        updateModeOptions();
    });
	
	updateModeOptions();
    loadConfiguration();
    updateDisplayedValues();
});
