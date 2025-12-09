document.addEventListener('DOMContentLoaded', () => {
    const deliveryCharge = 50;

    // ─────── PHONE VALIDATION (exactly 10 digit Indian number) ───────
    function isValidPhone(phone) {
        const cleaned = phone.replace(/\D/g, ''); // remove everything except digits
        return /^[6-9]\d{9}$/.test(cleaned);       // must start with 6-9 and exactly 10 digits
    }

    // ─────── BILL CALCULATOR (inline) ───────
    document.getElementById('calcBtn')?.addEventListener('click', () => {
        const fuel = document.getElementById('fuel').value;
        const litre = parseFloat(document.getElementById('litre').value);
        const billField = document.getElementById('estimatedBill');

        if (!fuel || !litre || litre <= 0) {
            alert('Fuel aur litre daalo pehle bhai!');
            billField.value = '';
            return;
        }

        const price = fuel === 'Petrol' ? 94.5 : 87.5;
        const total = (price * litre) + deliveryCharge;
        billField.value = total.toFixed(2);
    });

    // ─────── ORDER FORM SUBMIT ───────
    const orderForm = document.getElementById('orderForm');
    const billModalEl = document.getElementById('billModal');
    const billModal = new bootstrap.Modal(billModalEl);
    let currentOrder = null;

    orderForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const name    = document.getElementById('name').value.trim();
        const phone   = document.getElementById('phone').value.trim();
        const address = document.getElementById('address').value.trim();
        const fuel    = document.getElementById('fuel').value;
        const litre   = parseFloat(document.getElementById('litre').value);
        const timeslot= document.getElementById('timeslot').value;

        // === 10-DIGIT PHONE VALIDATION ===
        if (!isValidPhone(phone)) {
            alert('Phone number galat hai bhai!\n10 digit daalo aur 6,7,8,9 se shuru hona chahiye.');
            return;
        }

        if (!name || !address || !fuel || !litre || litre <= 0 || !timeslot) {
            alert('Sab fields bharo aur litre sahi daalo!');
            return;
        }

        const price = fuel === 'Petrol' ? 94.5 : 87.5;
        const total = (price * litre) + deliveryCharge;

        currentOrder = { name, phone, address, fuel, litre, price, total, timeslot, date: new Date().toLocaleString() };

        // Bill modal show
        document.getElementById('billContent').innerHTML = `
            <h5 class="text-center mb-3">Ghar Ka Pump – Order Bill</h5>
            <p><b>Naam :</b> ${name}</p>
            <p><b>Phone :</b> ${phone}</p>
            <p><b>Address :</b> ${address}</p>
            <hr>
            <p><b>Fuel :</b> ${fuel} – ${litre} L @ ₹${price}/L</p>
            <p><b>Delivery Charge :</b> ₹${deliveryCharge}</p>
            <p><b>Total Amount :</b> <strong style="font-size:1.4rem;color:#28a745">₹${total.toFixed(2)}</strong></p>
            <p><b>Time Slot :</b> ${timeslot}</p>
        `;

        billModal.show();
    });

    // ─────── CONFIRM & SEND TO WHATSAPP ───────
    document.getElementById('confirmSendBtn').addEventListener('click', () => {
        if (!currentOrder) return;

        const o = currentOrder;
        const text = `*Naya Order - Ghar Ka Pump*%0A%0A` +
            `Naam: ${o.name}%0A` +
            `Phone: ${o.phone}%0A` +
            `Address: ${o.address}%0A` +
            `Fuel: ${o.fuel}%0A` +
            `Litres: ${o.litre}%0A` +
            `Time Slot: ${o.timeslot}%0A%0A` +
            `Total: *₹${o.total.toFixed(2)}*%0A%0A` +
            `Date: ${o.date}`;

        // Tera number yahan change kar sakta hai
        window.open(`https://wa.me/919956808698?text=${text}`, '_blank');

        alert('Order successfully bhej diya bhai!');

        // BUG FIX: doosri baar bhi form perfect kaam karega
        billModal.hide();
        orderForm.reset();
        document.getElementById('estimatedBill').value = '';
        document.activeElement.blur();
        setTimeout(() => document.body.click(), 300); // backdrop clear

        currentOrder = null;
    });

    // ─────── MODAL BAND HONE PE BHI FORM RESET & FOCUS FIX ───────
    billModalEl.addEventListener('hidden.bs.modal', () => {
        orderForm.reset();
        document.getElementById('estimatedBill').value = '';
        document.activeElement.blur();
    });
});
