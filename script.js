const sendButton = document.getElementById("send-button");
const userInput = document.getElementById("user-input");
const aiResponseDiv = document.getElementById("ai-response");

sendButton.addEventListener("click", async () => {
    const userMessage = userInput.value.trim();
    if (userMessage === "") return;

    // Kullanıcı mesajını ekrana bas
    aiResponseDiv.innerHTML += `<div class="user-message"><strong>Sen:</strong> ${userMessage}</div>`;
    userInput.value = ""; // Input'u temizle

    try {
        const response = await fetch("http://localhost:3000/ask", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ message: userMessage })
        });

        // API'den gelen yanıtı kontrol et
        if (!response.ok) {
            const errorData = await response.json();
            aiResponseDiv.innerHTML += `<div class="error-message"><strong>API Hatası: ${errorData.error}</strong></div>`;
            return;
        }

        const data = await response.json();
        const aiMessage = data.response;

        // API cevabını ekrana bas
        aiResponseDiv.innerHTML += `<div class="ai-message"><strong>KyraxAi:</strong> ${aiMessage}</div>`;

        // Scroll'u en sona kaydır
        aiResponseDiv.scrollTop = aiResponseDiv.scrollHeight;

    } catch (error) {
        console.error("Bağlantı Hatası:", error);
        aiResponseDiv.innerHTML += `<div class="error-message"><strong>Bir hata oluştu, lütfen tekrar deneyin.</strong></div>`;
        aiResponseDiv.scrollTop = aiResponseDiv.scrollHeight;
    }
});
