// Bot Field Toggle Logic
document.addEventListener('DOMContentLoaded', function() {
    const botStart = document.getElementById('bot_start');
    const botInput = document.getElementById('bot_input');
    const botSend = document.getElementById('bot_send');
    const botCancel = document.getElementById('bot_cancel');
    const chatContainer = document.getElementById('chat_container');
    
    // Load AI context from file
    let aiContext = '';
    
    async function loadAIContext() {
        try {
            const response = await fetch('../ai-context.txt');
            if (response.ok) {
                aiContext = await response.text();
                console.log('AI Context loaded successfully');
            }
        } catch (error) {
            console.error('Failed to load AI context:', error);
        }
    }
    
    // Load context on page load
    loadAIContext();

    // Show input, send, and cancel when start button is clicked
    botStart.addEventListener('click', function() {
        // Fade out and scale down start button
        botStart.classList.remove('opacity-100', 'scale-100');
        botStart.classList.add('opacity-0', 'scale-0');
        
        // Wait for animation, then hide start button
        setTimeout(() => {
            botStart.classList.add('hidden');
        }, 300);
        
        // Show input, send, and cancel buttons with animation
        botInput.classList.remove('hidden');
        botInput.classList.add('flex');
        botSend.classList.remove('hidden');
        botSend.classList.add('flex');
        botCancel.classList.remove('hidden');
        botCancel.classList.add('flex');
        
        // Trigger animation after a small delay
        setTimeout(() => {
            botInput.classList.remove('opacity-0', 'scale-0');
            botInput.classList.add('opacity-100', 'scale-100');
            botSend.classList.remove('opacity-0', 'scale-0');
            botSend.classList.add('opacity-100', 'scale-100');
            botCancel.classList.remove('opacity-0', 'scale-0');
            botCancel.classList.add('opacity-100', 'scale-100');
        }, 50);
        
        // Focus on input after animation
        setTimeout(() => {
            botInput.focus();
        }, 350);
    });

    // Hide input, send, and cancel when cancel button is clicked
    botCancel.addEventListener('click', function() {
        // Fade out and scale down input, send, and cancel buttons
        botInput.classList.remove('opacity-100', 'scale-100');
        botInput.classList.add('opacity-0', 'scale-0');
        botSend.classList.remove('opacity-100', 'scale-100');
        botSend.classList.add('opacity-0', 'scale-0');
        botCancel.classList.remove('opacity-100', 'scale-100');
        botCancel.classList.add('opacity-0', 'scale-0');
        
        // Wait for animation, then hide buttons
        setTimeout(() => {
            botInput.classList.add('hidden');
            botInput.classList.remove('flex');
            botSend.classList.add('hidden');
            botSend.classList.remove('flex');
            botCancel.classList.add('hidden');
            botCancel.classList.remove('flex');
            
            // Show start button
            botStart.classList.remove('hidden');
            
            // Trigger show animation
            setTimeout(() => {
                botStart.classList.remove('opacity-0', 'scale-0');
                botStart.classList.add('opacity-100', 'scale-100');
            }, 50);
        }, 300);
        
        // Clear input
        botInput.value = '';
    });

    // Send button functionality (you can add your logic here)
    botSend.addEventListener('click', function() {
        const message = botInput.value.trim();
        if (message) {
            console.log('Message sent:', message);
            
            // Add user message to chat (left side)
            addUserMessage(message);
            
            // Clear input after sending
            botInput.value = '';
            botInput.focus();
            
            // Fetch API and add bot response
            fetchBotResponse(message);
        }
    });

    // Allow Enter key to send message
    botInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            botSend.click();
        }
    });
    
    // Function to add user message (left side)
    function addUserMessage(text) {
        const messageEl = document.createElement('div');
        messageEl.className = 'flex justify-start w-full opacity-0 transition-all duration-300';
        messageEl.innerHTML = `
            <div class="bg-primary text-white px-4 py-2 rounded-lg shadow-lg font-secondary text-sm max-w-xs">
                ${text}
            </div>
        `;
        
        chatContainer.appendChild(messageEl);
        chatContainer.scrollTop = chatContainer.scrollHeight;
        
        // Fade in
        setTimeout(() => {
            messageEl.style.opacity = '1';
        }, 50);
        
        // Auto-hide after 7 seconds
        setTimeout(() => {
            messageEl.style.opacity = '0';
            setTimeout(() => {
                if (chatContainer.contains(messageEl)) {
                    chatContainer.removeChild(messageEl);
                }
            }, 300);
        }, 7000);
    }
    
    // Function to add bot response (right side)
    function addBotMessage(text) {
        const messageEl = document.createElement('div');
        messageEl.className = 'flex justify-end w-full opacity-0 transition-all duration-300';
        messageEl.innerHTML = `
            <div class="bg-primary text-white px-4 py-2 rounded-lg shadow-lg font-secondary text-sm max-w-xs">
                ${text}
            </div>
        `;
        
        chatContainer.appendChild(messageEl);
        chatContainer.scrollTop = chatContainer.scrollHeight;
        
        // Fade in
        setTimeout(() => {
            messageEl.style.opacity = '1';
        }, 50);
        
        // Auto-hide after 7 seconds
        setTimeout(() => {
            messageEl.style.opacity = '0';
            setTimeout(() => {
                if (chatContainer.contains(messageEl)) {
                    chatContainer.removeChild(messageEl);
                }
            }, 300);
        }, 7000);
    }
    
    // Function to get response from OpenRouter
    async function getOpenRouterResponse(message) {
        const apiKey = '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';
        
        // Construct system message with AI context
        const systemMessage = aiContext 
            ? `You are a helpful and friendly AI assistant for Catur Hendra's portfolio website. Your role is to help visitors learn about the portfolio owner, answer questions about their projects, skills, and experience.

PORTFOLIO INFORMATION:
${aiContext}

IMPORTANT RULES:
- Keep ALL responses VERY SHORT and BRIEF (maximum 2-3 sentences)
- Answer directly without long explanations
- Be friendly but concise
- Use simple language
- If asked about something not in the context, give a short response saying you don't have that info
- No lengthy introductions or conclusions`
            : 'You are a helpful AI assistant for a portfolio website. Keep responses VERY SHORT (2-3 sentences max). Answer directly and concisely.';
        
        try {
            const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json',
                    'HTTP-Referer': window.location.href,
                    'X-Title': 'Portfolio Chat'
                },
                body: JSON.stringify({
                    model: 'deepseek/deepseek-v3.2',
                    messages: [
                        {
                            role: 'system',
                            content: systemMessage
                        },
                        {
                            role: 'user',
                            content: message
                        }
                    ]
                })
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error?.message || 'API request failed');
            }
            
            const data = await response.json();
            return data.choices[0].message.content;
            
        } catch (error) {
            console.error('OpenRouter Error:', error);
            throw error;
        }
    }
    
    // Function to fetch bot response from API
    async function fetchBotResponse(message) {
        try {
            // Show loading message
            const loadingEl = document.createElement('div');
            loadingEl.className = 'flex justify-end w-full';
            loadingEl.innerHTML = `
                <div class="bg-primary text-white px-4 py-2 rounded-lg shadow-lg font-secondary text-sm max-w-xs">
                    🤖 Thinking...
                </div>
            `;
            chatContainer.appendChild(loadingEl);
            chatContainer.scrollTop = chatContainer.scrollHeight;
            
            // Get response from OpenRouter
            const responseText = await getOpenRouterResponse(message);
            
            // Remove loading message
            chatContainer.removeChild(loadingEl);
            
            // Add bot response
            addBotMessage(responseText);
            
        } catch (error) {
            console.error('Error fetching bot response:', error);
            // Remove loading if exists
            const loadingEl = chatContainer.lastChild;
            if (loadingEl && loadingEl.innerHTML.includes('Thinking')) {
                chatContainer.removeChild(loadingEl);
            }
            addBotMessage('Sorry, I encountered an error. Please try again.');
        }
    }
});