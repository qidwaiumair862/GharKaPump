// script.js — FINAL: Dark mode, Bill calc, Time slot, Admin (localStorage), WhatsApp send

document.addEventListener('DOMContentLoaded', () => {
    // Config / Defaults
    const deliveryCharge = 50; // same as UI text
    const petrolPriceEl = document.getElementById('petrolPrice');
    const dieselPriceEl = document.getElementById('dieselPrice');
    const deliveryChargeText = document.getElementById('deliveryChargeText');
    deliveryChargeText.textContent = deliveryCharge;

    // Admin modal elements
    const adminModalEl = document.getElementById('adminModal');
    const adminModal = new bootstrap.Modal(adminModalEl);
    const openAdminBtn = document.getElementById('openAdminBtn');

    openAdminBtn.addEventListener('click', (e) => {
        e.preventDefault();
        renderAdmin();
        adminModal.show();
    });

    document.getElementById('clearOrdersBtn').addEventListener('click', () => {
        if (!confirm('Saare orders delete karne hain? (localStorage se)')) return;
        localStorage.removeItem('gp_orders');
        renderAdmin();
    });

    // Dark mode toggle
    const darkToggle = document.getElementById('darkModeToggle');
    const savedTheme = localStorage.getItem('gp_theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark');
        darkToggle.checked = true;
    } else {
        document.body.classList.remove('dark');
        darkToggle.checked = false;
    }
    darkToggle.addEventListener('change', () => {
        if (darkToggle.checked) {
            document.body.classList.add('dark');
            localStorage.setItem('gp_theme', 'dark');
        } else {
            document.body.classList.remove('dark');
            localStorage.setItem('gp_theme', 'light');
        }
    });

    // Calculator
    const calcBtn = document.getElementById('calcBtn');
    calcBtn.addEventListener('click', calculateBillAndShowInline);

    function parsePrice(val) {
        const n = parseFloat(val);
        return isNaN(n) ? 0 : n;
    }

    function getUnitPrice(fuelType) {
        if (fuelType === 'Petrol') return parsePrice(petrolPriceEl.textContent);
        if (fuelType === 'Diesel') return parsePrice(dieselPriceEl.textContent);
        return 0;
    }

    function calculateTotal(fuelType, litres) {
        const unit = getUnitPrice(fuelType);
        const fuelCost = unit * litres;
        const total = fuelCost + deliveryCharge;
        return { unit, fuelCost, total };
    }

    function calculateBillAndShowInline() {
        const fuel = document.getElementById('fuel').value;
        const litres = parseFloat(document.getElementById('litre').value);
        const estimatedBill = document.getElementById('estimatedBill');

        if (!fuel || !litres || litres <= 0) {
            alert('Fuel type aur litres select karo pehle bhai.');
            return;
        }
        const { unit, fuelCost, total } = calculateTotal(fuel, litres);
        estimatedBill.value = total.toFixed(2);
    }

    // ORDER FORM handling (show bill modal first, then send)
    const orderForm = document.getElementById('orderForm');
    const billModalEl = document.getElementById('billModal');
    const billModal = new bootstrap.Modal(billModalEl);
    const billContent = document.getElementById('billContent');
    const confirmSendBtn = document.getElementById('confirmSendBtn');

    let lastPreparedOrder = null;

    orderForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const name    = document.getElementById("name").value.trim();
        const phone   = document.getElementById("phone").value.trim();
        const address = document.getElementById("address").value.trim();
        const fuel    = document.getElementById("fuel").value;
        const litre   = parseFloat(document.getElementById("litre").value);
        const timeslot = document.getElementById("timeslot").value;

        if (!name || !phone || !address || !fuel || !litre || !timeslot) {
            alert("Sab fields bharo bhai!");
            return;
        }

        // calculate bill
        const { unit, fuelCost, total } = calculateTotal(fuel, litre);

        // prepare bill html
        const now = new Date();
        const orderObj = {
            id: 'ORD' + Date.now(),
            name, phone, address, fuel, litre,
            unitPrice: unit,
            fuelCost: fuelCost,
            deliveryCharge,
            total: total,
            timeslot,
            date: now.toLocaleString()
        };

        lastPreparedOrder = orderObj;
        renderBillModal(orderObj);
        billModal.show();
    });

    function renderBillModal(order) {
        billContent.innerHTML = `
            <h5>Ghar Ka Pump — Order Bill</h5>
            <div class="bill-row"><div>Naam:</div><div><strong>${escapeHtml(order.name)}</strong></div></div>
            <div class="bill-row"><div>Phone:</div><div>${escapeHtml(order.phone)}</div></div>
            <div class="bill-row"><div>Address:</div><div>${escapeHtml(order.address)}</div></div>
            <hr/>
            <div class="bill-row"><div>Fuel:</div><div>${escapeHtml(order.fuel)}</div></div>
            <div class="bill-row"><div>Litres:</div><div>${order.litre} L</div></div>
            <div class="bill-row"><div>Unit Price:</div><div>₹${order.unitPrice.toFixed(2)} /L</div></div>
            <div class="bill-row"><div>Fuel Cost:</div><div>₹${order.fuelCost.toFixed(2)}</div></div>
            <div class="bill-row"><div>Delivery Charge:</div><div>₹${order.deliveryCharge.toFixed(2)}</div></div>
            <hr/>
            <div class="bill-row"><div><strong>Total:</strong></div><div><strong>₹${order.total.toFixed(2)}</strong></div></div>
            <div class="bill-row"><div>Time Slot:</div><div>${escapeHtml(order.timeslot)}</div></div>
            <div class="bill-row"><div>Order Date:</div><div>${escapeHtml(order.date)}</div></div>
        `;
    }

    confirmSendBtn.addEventListener('click', () => {
        if (!lastPreparedOrder) {
            alert('Kuch prepare nahi hai!');
            return;
        }
        // Save order to localStorage for admin panel
        saveOrderToLocal(lastPreparedOrder);

        // Compose WhatsApp message
        const myNumber = "919956808698"; // tera number - change if needed
        const ord = lastPreparedOrder;
        const text = `*Naya Order - Ghar Ka Pump*%0A%0A` +
                     `Naam: ${encodeURIComponent(ord.name)}%0A` +
                     `Phone: ${encodeURIComponent(ord.phone)}%0A` +
                     `Address: ${encodeURIComponent(ord.address)}%0A` +
                     `Fuel: ${encodeURIComponent(ord.fuel)}%0A` +
                     `Litres: ${ord.litre}%0A` +
                     `Time Slot: ${encodeURIComponent(ord.timeslot)}%0A%0A` +
                     `Unit Price: ₹${ord.unitPrice.toFixed(2)}%0A` +
                     `Fuel Cost: ₹${ord.fuelCost.toFixed(2)}%0A` +
                     `Delivery: ₹${ord.deliveryCharge.toFixed(2)}%0A` +
                     `Total: *₹${ord.total.toFixed(2)}*%0A%0A` +
                     `Order Date: ${encodeURIComponent(ord.date)}%0A%0A` +
                     `Jaldi bhejo bhai!`;

        // Invisible iframe trick – customer ko kuch nahi dikhega
        const iframe = document.createElement("iframe");
        iframe.style.display = "none";
        iframe.src = `https://api.whatsapp.com/send?phone=${myNumber}&text=${text}`;
        document.body.appendChild(iframe);

        // 2 second baad iframe hata denge
        setTimeout(() => {
            try { document.body.removeChild(iframe); } catch(e){ /* ignore */ }
        }, 2000);

        // Success popup
        alert(`Order successfully sent! ✅\n\n${ord.name} – ${ord.litre} Litre ${ord.fuel}\nTera WhatsApp check kar le!`);

        // Close bill modal and reset form
        const bootstrapModal = bootstrap.Modal.getInstance(billModalEl);
        if (bootstrapModal) bootstrapModal.hide();

        orderForm.reset();
        document.getElementById('estimatedBill').value = '';
    });

    // Helper: localStorage for admin
    function saveOrderToLocal(order) {
        const key = 'gp_orders';
        const arrRaw = localStorage.getItem(key);
        let arr = [];
        if (arrRaw) {
            try { arr = JSON.parse(arrRaw) } catch(e){ arr = []; }
        }
        arr.unshift(order); // latest first
        localStorage.setItem(key, JSON.stringify(arr));
        // update admin UI if open
        renderAdmin();
    }

    function renderAdmin() {
        const key = 'gp_orders';
        const arrRaw = localStorage.getItem(key);
        let arr = [];
        if (arrRaw) {
            try { arr = JSON.parse(arrRaw) } catch(e){ arr = []; }
        }
        const tbody = document.querySelector('#ordersTable tbody');
        tbody.innerHTML = '';
        let totalLitres = 0;
        let totalSales = 0;
        arr.forEach((o, i) => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${i+1}</td>
                <td>${escapeHtml(o.name)}</td>
                <td>${escapeHtml(o.phone)}</td>
                <td style="max-width:220px;word-wrap:break-word;">${escapeHtml(o.address)}</td>
                <td>${escapeHtml(o.fuel)}</td>
                <td>${o.litre}</td>
                <td>${escapeHtml(o.timeslot)}</td>
                <td>₹${parseFloat(o.total).toFixed(2)}</td>
                <td>${escapeHtml(o.date)}</td>
            `;
            tbody.appendChild(tr);
            totalLitres += Number(o.litre);
            totalSales += Number(o.total);
        });
        document.getElementById('adminTotalOrders').textContent = arr.length;
        document.getElementById('adminTotalLitres').textContent = totalLitres;
        document.getElementById('adminTotalSales').textContent = totalSales.toFixed(2);
    }

    // Simple escape for text injection safety
    function escapeHtml(str) {
        if (!str && str !== 0) return '';
        return String(str)
            .replaceAll('&', '&amp;')
            .replaceAll('<', '&lt;')
            .replaceAll('>', '&gt;')
            .replaceAll('"', '&quot;')
            .replaceAll("'", '&#039;');
    }

    // initial admin render if open
    renderAdmin();
});
