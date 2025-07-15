// Pastikan browser mendukung API ini
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
if (SpeechRecognition) {
    // Inisialisasi speech recognition
    const recognition = new SpeechRecognition();

    // Mengatur bahasa (opsional, default 'en-US')
    recognition.lang = 'en-US';

    // Mengatur recognition agar terus mendengarkan
    recognition.continuous = true; // Mode continuous listening
    recognition.interimResults = false;

    // Fungsi untuk menampilkan teks menggunakan Typed.js
    const showTypedText = (elementId, text, typeSpeed = 70) => {
        new Typed(elementId, {
            strings: [text],
            typeSpeed: typeSpeed,
            loop: false,
            showCursor: false,
        });
    };

    // Apa yang terjadi saat ada hasil pengenalan suara
    recognition.onresult = (event) => {
        const transcript = event.results[event.results.length - 1][0].transcript.toLowerCase();
        console.log(`You said: ${transcript}`);
        
        
        // Periksa hasil pengenalan suara dan tampilkan respons
        if (transcript.includes('name')) {
            showTypedText('#response-text', "As you can see, my name is Catur Hendra");
        } else if (transcript.includes('collage') || transcript.includes('university')) {
            showTypedText('#response-text', "I am a student at State University of Surabaya");
        } else {
            showTypedText('#response-text', "I can't hear you, say again", 20);
        }
    };

    // Jika terjadi error
    recognition.onerror = (event) => {
        console.error('Error occurred in recognition: ', event.error);
    };

    // Event yang dipicu saat recognition dimulai
    recognition.onstart = () => {
        console.log('Listening started...');
    };

    // Jangan restart otomatis saat recognition berakhir
    recognition.onend = () => {
        console.log('Listening ended...');
        // Jangan panggil recognition.start() di sini untuk menghindari izin ulang
    };

    // Mulai mendengarkan saat tombol diklik (hanya satu kali)
    document.getElementById('btn-speech').addEventListener('click', () => {
        recognition.start();
        document.getElementById('response-box').classList.remove('hidden');
        showTypedText('#response-text', "Hei!!, say something", 20);
        document.getElementById('btn-speech').disabled = true; // Nonaktifkan tombol setelah mulai
    });
} else {
    alert('Browser tidak mendukung Web Speech API.');
}
