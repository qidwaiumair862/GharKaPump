// script.js — Ghar Ka Pump ka WhatsApp Magic

document.getElementById("orderForm").addEventListener("submit", function(e) {
    e.preventDefault(); // form reload nahi hoga

    // Form se data le rahe hain
    const name = document.getElementById("name").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const address = document.getElementById("address").value.trim();
    const fuel = document.getElementById("fuel").value;
    const litre = document.getElementById("litre").value;

    // Agar kuch khali hai toh rok do
    if (!name || !phone || !address || !fuel || !litre) {
        alert("Bhai sab fields bhar do pehle!");
        return;
    }

    // ←←←←← YAHAN APNA SACCHA NUMBER DAAL DE (sirf 91 + 10 digit) ←←←←←
    const yourWhatsAppNumber = "919956808690";   // ← Isme apna number daal de, jaise 919876543210

    // Order message ban raha hai
    const message = `🛢️ *Naya Order - Ghar Ka Pump* 🛢️%0A%0A` +
                    `👤 Naam: ${name}%0A` +
                    `📞 Phone: ${phone}%0A` +
                    `🏠 Address: ${address}%0A` +
                    `⛽ Fuel: ${fuel}%0A` +
                    `📏 Quantity: ${litre} Litre%0A%0A` +
                    `Jaldi bhejo bhai, customer wait kar raha hai! 🚀`;

    const whatsappURL = `https://wa.me/${yourWhatsAppNumber}?text=${message}`;

    window.open(whatsappURL, "_blank");

    alert("Order WhatsApp pe bhej diya! 🚀\nAb customer ka call aayega!");

    document.getElementById("orderForm").reset();
});
