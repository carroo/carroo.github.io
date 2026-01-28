// Bot Field Toggle Logic
document.addEventListener('DOMContentLoaded', function() {
    const botStart = document.getElementById('bot_start');
    const botInput = document.getElementById('bot_input');
    const botSend = document.getElementById('bot_send');
    const botCancel = document.getElementById('bot_cancel');
    const chatContainer = document.getElementById('chat_container');

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
    
    // Function to get response from Carroo API
    async function getCarrooResponse(message) {
        try {
            const formData = new FormData();
            formData.append('message', message);
            
            const response = await fetch('https://crm.ictitlmi.info/chatbot/carroo_response', {
                method: 'POST',
                body: formData
            });
            
            if (!response.ok) {
                throw new Error('API request failed');
            }
            
            const data = await response.json();
            
            if (!data.success) {
                throw new Error(data.message || 'Failed to get response');
            }
            
            return data.message;
            
        } catch (error) {
            console.error('Carroo API Error:', error);
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
            
            // Get response from Carroo API
            const responseText = await getCarrooResponse(message);
            
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