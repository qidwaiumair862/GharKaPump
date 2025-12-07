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

    // Yeh tera WhatsApp number daal dena (country code ke saath)
    const yourWhatsAppNumber = "919956808690"; // ←←←←← YAHAN APNA NUMBER DAAL DENA

    // Order message ban raha hai (mast Hindi mein)
    const message = `🛢️ *Naya Order - Ghar Ka Pump* 🛢️%0A%0A` +
                    `👤 Naam: ${name}%0A` +
                    `📞 Phone: ${phone}%0A` +
                    `🏠 Address: ${address}%0A` +
                    `⛽ Fuel: ${fuel}%0A` +
                    `📏 Quantity: ${litre} Litre%0A%0A` +
                    `Jaldi bhejo bhai, customer wait kar raha hai! 🚀`;

    // WhatsApp link
    const whatsappURL = `https://wa.me/${yourWhatsAppNumber}?text=${message}`;

    // Naya tab kholo aur WhatsApp pe le jao
    window.open(whatsappURL, "_blank");

    // Success wala mast alert
    alert("Order WhatsApp pe bhej diya! 🚀\nAb customer ka call aayega!");

    // Form reset kar do
    document.getElementById("orderForm").reset();
});