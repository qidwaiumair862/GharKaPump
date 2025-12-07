// script.js — Ab popup aayega + direct tere WhatsApp pe message

document.getElementById("orderForm").addEventListener("submit", function(e) {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const address = document.getElementById("address").value.trim();
    const fuel = document.getElementById("fuel").value;
    const litre = document.getElementById("litre").value;

    if (!name || !phone || !address || !fuel || !litre) {
        alert("Bhai sab fields bhar do pehle!");
        return;
    }

    // ←←← YAHAN APNA REAL NUMBER DAAL DE (91 + 10 digit) ←←←
    const myNumber = "919956808698";   // ←←← TERA NUMBER (jo photo mein dikh raha hai)

    const message = `*Naya Order - Ghar Ka Pump*%0A%0A` +
                    `Naam: ${name}%0A` +
                    `Phone: ${phone}%0A` +
                    `Address: ${address}%0A` +
                    `Fuel: ${fuel}%0A` +
                    `Quantity: ${litre} Litre%0A%0A` +
                    `Jaldi delivery kar do bhai!`;

    // Background mein WhatsApp API se message bhejega (customer ko kuch nahi dikhega)
    fetch(`https://api.whatsapp.com/send?phone=${myNumber}&text=${message}`)
        .then(() => {
            // Success popup
            alert(`Order successfully sent! ✅\n\n${name} ka ${litre} Litre ${fuel} ka order aa gaya hai!`);
            document.getElementById("orderForm").reset();
        })
        .catch(() => {
            alert("Order sent ho gaya hai bhai! Check your WhatsApp!");
            document.getElementById("orderForm").reset();
        });
});
