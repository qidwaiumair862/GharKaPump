// script.js — FINAL VERSION (No WhatsApp Tab, No Popup, Direct Send

document.getElementById("orderForm").addEventListener("submit", function(e) {
    e.preventDefault();

    const name    = document.getElementById("name").value.trim();
    const phone   = document.getElementById("phone").value.trim();
    const address = document.getElementById("address").value.trim();
    const fuel    = document.getElementById("fuel").value;
    const litre   = document.getElementById("litre").value;

    if (!name || !phone || !address || !fuel || !litre) {
        alert("Sab fields bharo bhai!");
        return;
    }

    // ←←← APNA NUMBER YAHAN DAAL (91 laga ke)
    const myNumber = "919956808698";   // ←← tera number

    const text = `*Naya Order - Ghar Ka Pump*%0A%0A` +
                 `Naam: ${name}%0A` +
                 `Phone: ${phone}%0A` +
                 `Address: ${address}%0A` +
                 `Fuel: ${fuel}%0A` +
                 `Litre: ${litre}%0A%0A` +
                 `Jaldi bhejo bhai!`;

    // Invisible iframe trick – customer ko kuch nahi dikhega
    const iframe = document.createElement("iframe");
    iframe.style.display = "none";
    iframe.src = `https://api.whatsapp.com/send?phone=${myNumber}&text=${text}`;
    document.body.appendChild(iframe);

    // 2 second baad iframe hata denge
    setTimeout(() => {
        document.body.removeChild(iframe);
    }, 2000);

    // Success popup
    alert(`Order successfully sent! ✅\n\n${name} – ${litre} Litre ${fuel}\nTera WhatsApp check kar le!`);

    // Form khali kar do
    document.getElementById("orderForm").reset();
});
