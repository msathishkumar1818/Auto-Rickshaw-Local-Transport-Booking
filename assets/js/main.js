/**
 * AutoPulse - Auto Rickshaw & Local Transport Booking
 * Main JavaScript: main.js (Updated with Scroll-to-Top & Dedicated Booking Flow)
 */

(function () {
  'use strict';

  // --- 1. Theme Management (Dark Mode: #000000 bg, #FFFFFF text) ---
  const THEME_KEY = 'autopulse_theme';

  function initTheme() {
    const savedTheme = localStorage.getItem(THEME_KEY);
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      document.documentElement.classList.add('dark');
      updateThemeButtons(true);
    } else {
      document.documentElement.classList.remove('dark');
      updateThemeButtons(false);
    }
  }

  function toggleTheme() {
    const isDark = document.documentElement.classList.toggle('dark');
    localStorage.setItem(THEME_KEY, isDark ? 'dark' : 'light');
    updateThemeButtons(isDark);
    showToast(isDark ? 'Dark mode activated' : 'Light mode activated');
  }

  function updateThemeButtons(isDark) {
    const toggles = document.querySelectorAll('.theme-toggle-btn');
    toggles.forEach(btn => {
      const icon = btn.querySelector('.theme-icon');
      const label = btn.querySelector('.theme-label');
      if (icon) {
        icon.innerHTML = isDark 
          ? `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 9h-1m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>`
          : `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>`;
      }
      if (label) {
        label.textContent = isDark ? 'Light Mode' : 'Dark Mode';
      }
    });
  }

  // --- 2. RTL / LTR Direction Management ---
  const DIR_KEY = 'autopulse_dir';

  function initDirection() {
    const savedDir = localStorage.getItem(DIR_KEY) || 'ltr';
    document.documentElement.setAttribute('dir', savedDir);
    updateDirButtons(savedDir === 'rtl');
  }

  function toggleDirection() {
    const currentDir = document.documentElement.getAttribute('dir') || 'ltr';
    const newDir = currentDir === 'ltr' ? 'rtl' : 'ltr';
    document.documentElement.setAttribute('dir', newDir);
    localStorage.setItem(DIR_KEY, newDir);
    updateDirButtons(newDir === 'rtl');
    showToast(newDir === 'rtl' ? 'RTL Layout enabled' : 'LTR Layout enabled');
  }

  function updateDirButtons(isRTL) {
    const toggles = document.querySelectorAll('.rtl-toggle-btn');
    toggles.forEach(btn => {
      const label = btn.querySelector('.dir-label');
      if (label) {
        label.textContent = isRTL ? 'LTR' : 'RTL';
      }
    });
  }

  // --- 3. Scroll-to-Top Button on Every Page ---
  function initScrollToTop() {
    let btn = document.querySelector('.scroll-to-top-btn');
    if (!btn) {
      btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'scroll-to-top-btn';
      btn.setAttribute('aria-label', 'Scroll to top');
      btn.setAttribute('title', 'Scroll to top');
      btn.innerHTML = `
        <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M5 15l7-7 7 7" />
        </svg>
      `;
      document.body.appendChild(btn);
    }

    window.addEventListener('scroll', () => {
      if (window.scrollY > 300) {
        btn.classList.add('visible');
      } else {
        btn.classList.remove('visible');
      }
    });

    btn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // --- 4. Mobile Drawer Navigation & Dynamic Active States ---
  function getActivePageName() {
    let path = window.location.pathname.split('/').pop() || 'index.html';
    path = path.split('?')[0].split('#')[0];
    if (!path || path === '' || path === '/') {
      path = 'index.html';
    }
    return path;
  }

  function initActiveNav() {
    const currentPage = getActivePageName();
    const isHome = (currentPage === 'index.html' || currentPage === 'home-2.html');

    // 1. Desktop Nav Active State Detection
    const desktopLinks = document.querySelectorAll('.desktop-nav .nav-link');
    desktopLinks.forEach(link => {
      link.classList.remove('active');
    });

    const desktopDropdownLinks = document.querySelectorAll('.nav-dropdown-menu .nav-dropdown-link');
    desktopDropdownLinks.forEach(link => {
      link.classList.remove('active', 'font-semibold', 'text-amber-600', 'dark:text-amber-400');
      const dot = link.querySelector('span');
      if (dot) {
        dot.className = 'w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-700 transition-colors';
      }
    });

    if (isHome) {
      const homeParent = document.querySelector('.nav-item-dropdown > .nav-link');
      if (homeParent) homeParent.classList.add('active');

      desktopDropdownLinks.forEach(link => {
        const href = link.getAttribute('href') || '';
        if (href.endsWith(currentPage) || href === currentPage) {
          link.classList.add('active', 'font-semibold', 'text-amber-600', 'dark:text-amber-400');
          const dot = link.querySelector('span');
          if (dot) {
            dot.className = 'w-2 h-2 rounded-full bg-amber-500';
          }
        }
      });
    } else {
      desktopLinks.forEach(link => {
        const href = link.getAttribute('href') || '';
        if (href.endsWith(currentPage) || href === currentPage) {
          link.classList.add('active');
        }
      });
    }

    // 2. Mobile Drawer Nav Active State Detection
    const mobileNavLinks = document.querySelectorAll('.mobile-drawer .mobile-nav-link:not(.mobile-subnav-toggle), .mobile-menu-drawer .mobile-nav-link:not(.mobile-subnav-toggle)');
    const mobileSubnavLinks = document.querySelectorAll('.mobile-drawer .mobile-subnav-link, .mobile-menu-drawer .mobile-subnav-link');
    const homeToggle = document.querySelector('.mobile-subnav-toggle');

    mobileNavLinks.forEach(link => link.classList.remove('active'));
    mobileSubnavLinks.forEach(link => link.classList.remove('active'));

    if (homeToggle) {
      homeToggle.classList.remove('active');
    }

    if (isHome) {
      if (homeToggle) {
        homeToggle.classList.add('active');
      }

      mobileSubnavLinks.forEach(link => {
        const href = link.getAttribute('href') || '';
        if (href.endsWith(currentPage) || href === currentPage) {
          link.classList.add('active');
        }
      });
    } else {
      mobileNavLinks.forEach(link => {
        const href = link.getAttribute('href') || '';
        if (href.endsWith(currentPage) || href === currentPage) {
          link.classList.add('active');
        }
      });
    }
  }

  // --- 4b. Desktop / Tablet Dropdown Click & Hover Management ---
  function initDesktopDropdowns() {
    const dropdownItems = document.querySelectorAll('.nav-item-dropdown');

    dropdownItems.forEach(item => {
      const trigger = item.querySelector('.nav-link');
      const menu = item.querySelector('.nav-dropdown-menu');
      if (!trigger || !menu) return;

      trigger.setAttribute('role', 'button');
      trigger.setAttribute('aria-haspopup', 'true');
      trigger.setAttribute('aria-expanded', 'false');

      // Click to toggle dropdown
      trigger.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();

        const isOpen = item.classList.contains('open');

        // Close any other open dropdowns first
        dropdownItems.forEach(otherItem => {
          if (otherItem !== item) {
            otherItem.classList.remove('open');
            const otherMenu = otherItem.querySelector('.nav-dropdown-menu');
            if (otherMenu) otherMenu.classList.remove('show');
            const otherTrigger = otherItem.querySelector('.nav-link');
            if (otherTrigger) otherTrigger.setAttribute('aria-expanded', 'false');
          }
        });

        if (isOpen) {
          item.classList.remove('open');
          menu.classList.remove('show');
          trigger.setAttribute('aria-expanded', 'false');
        } else {
          item.classList.add('open');
          menu.classList.add('show');
          trigger.setAttribute('aria-expanded', 'true');
        }
      });

      // Close when clicking any link inside dropdown
      menu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
          item.classList.remove('open');
          menu.classList.remove('show');
          trigger.setAttribute('aria-expanded', 'false');
        });
      });
    });

    // Close dropdown on click outside
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.nav-item-dropdown')) {
        dropdownItems.forEach(item => {
          item.classList.remove('open');
          const menu = item.querySelector('.nav-dropdown-menu');
          if (menu) menu.classList.remove('show');
          const trigger = item.querySelector('.nav-link');
          if (trigger) trigger.setAttribute('aria-expanded', 'false');
        });
      }
    });

    // Close dropdown on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        dropdownItems.forEach(item => {
          item.classList.remove('open');
          const menu = item.querySelector('.nav-dropdown-menu');
          if (menu) menu.classList.remove('show');
          const trigger = item.querySelector('.nav-link');
          if (trigger) trigger.setAttribute('aria-expanded', 'false');
        });
      }
    });
  }

  function initMobileDrawer() {
    const toggleBtns = document.querySelectorAll('.mobile-menu-btn, .mobile-menu-open');
    const closeBtns = document.querySelectorAll('.mobile-menu-close');
    const drawer = document.getElementById('mobile-drawer');
    const backdrop = document.getElementById('mobile-backdrop');
    const subnavToggles = document.querySelectorAll('.mobile-subnav-toggle');

    function resetAllSubnavs() {
      subnavToggles.forEach(toggle => {
        const subnav = toggle.nextElementSibling;
        const icon = toggle.querySelector('.toggle-icon');
        if (subnav) subnav.classList.remove('open');
        if (icon) icon.classList.remove('rotate-180');
        toggle.setAttribute('aria-expanded', 'false');
      });
    }

    function openDrawer() {
      if (!drawer || !backdrop) return;
      // Always reset submenus to closed when opening mobile menu
      resetAllSubnavs();
      drawer.classList.add('active');
      backdrop.classList.add('active');
      document.body.classList.add('drawer-open');
      document.documentElement.classList.add('drawer-open');
      drawer.setAttribute('aria-hidden', 'false');
      toggleBtns.forEach(btn => {
        btn.classList.add('active');
        btn.setAttribute('aria-expanded', 'true');
      });
    }

    function closeDrawer() {
      if (!drawer || !backdrop) return;
      drawer.classList.remove('active');
      backdrop.classList.remove('active');
      document.body.classList.remove('drawer-open');
      document.documentElement.classList.remove('drawer-open');
      drawer.setAttribute('aria-hidden', 'true');
      toggleBtns.forEach(btn => {
        btn.classList.remove('active');
        btn.setAttribute('aria-expanded', 'false');
      });
      // Reset all submenus when drawer closes
      resetAllSubnavs();
    }

    // Ensure initial state on page load is fully closed
    resetAllSubnavs();

    toggleBtns.forEach(btn => {
      btn.setAttribute('aria-expanded', 'false');
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        if (drawer && drawer.classList.contains('active')) {
          closeDrawer();
        } else {
          openDrawer();
        }
      });
    });

    closeBtns.forEach(btn => btn.addEventListener('click', closeDrawer));
    if (backdrop) backdrop.addEventListener('click', closeDrawer);

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && drawer && drawer.classList.contains('active')) {
        closeDrawer();
      }
    });

    // Close drawer when any interactive link is clicked inside the drawer
    if (drawer) {
      const allActionLinks = drawer.querySelectorAll('a');
      allActionLinks.forEach(link => {
        link.addEventListener('click', () => {
          closeDrawer();
        });
      });
    }

    // Submenu accordion: smooth expand/collapse and only one open at a time
    subnavToggles.forEach(toggle => {
      toggle.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const subnav = toggle.nextElementSibling;
        const icon = toggle.querySelector('.toggle-icon');
        const isCurrentlyOpen = subnav && subnav.classList.contains('open');

        // Close all other open dropdowns
        subnavToggles.forEach(otherToggle => {
          if (otherToggle !== toggle) {
            const otherSubnav = otherToggle.nextElementSibling;
            const otherIcon = otherToggle.querySelector('.toggle-icon');
            if (otherSubnav) otherSubnav.classList.remove('open');
            if (otherIcon) otherIcon.classList.remove('rotate-180');
            otherToggle.setAttribute('aria-expanded', 'false');
          }
        });

        // Toggle the current dropdown
        if (subnav) {
          if (isCurrentlyOpen) {
            subnav.classList.remove('open');
            if (icon) icon.classList.remove('rotate-180');
            toggle.setAttribute('aria-expanded', 'false');
          } else {
            subnav.classList.add('open');
            if (icon) icon.classList.add('rotate-180');
            toggle.setAttribute('aria-expanded', 'true');
          }
        }
      });
    });
  }

  // --- 5. Interactive Dedicated Booking Engine (booking.html) ---
  function initDedicatedBooking() {
    const bookingForm = document.getElementById('rental-booking-form');
    if (!bookingForm) return;

    const bikeTypeRadios = document.querySelectorAll('input[name="vehicle_choice"]');
    const durationRadios = document.querySelectorAll('input[name="rental_duration"]');
    const pickupDateInput = document.getElementById('booking-pickup-date');
    const pickupLocSelect = document.getElementById('booking-pickup-loc');
    const extraCheckboxes = document.querySelectorAll('input[name="optional_extras"]');

    // Summary elements
    const sumVehicle = document.getElementById('sum-vehicle-name');
    const sumDuration = document.getElementById('sum-duration-name');
    const sumDate = document.getElementById('sum-date-name');
    const sumLocation = document.getElementById('sum-location-name');
    const sumExtrasList = document.getElementById('sum-extras-list');
    const sumRentalPrice = document.getElementById('sum-rental-price');
    const sumDeposit = document.getElementById('sum-deposit-price');
    const sumTotal = document.getElementById('sum-total-price');

    // Vehicle Pricing Catalog
    const vehicleCatalog = {
      'city-bike': { name: 'Premium City Cruiser Bike', hourly: 80, halfDay: 280, fullDay: 480, multiDay: 1200, deposit: 500 },
      'ebike': { name: 'Urban Power E-Bike (60km Range)', hourly: 150, halfDay: 450, fullDay: 750, multiDay: 1900, deposit: 1000 },
      'tandem-bike': { name: 'Two-Rider Tandem Bike', hourly: 120, halfDay: 380, fullDay: 620, multiDay: 1550, deposit: 800 },
      'green-e-auto': { name: 'Green E-Rickshaw Feeder (3-Seats)', hourly: 180, halfDay: 550, fullDay: 850, multiDay: 2200, deposit: 500 },
      'cng-auto': { name: 'Standard Metered CNG Auto', hourly: 160, halfDay: 500, fullDay: 800, multiDay: 2000, deposit: 500 }
    };

    // Duration Multipliers / Names
    const durationCatalog = {
      'hourly': { label: 'Hourly Rental (2 Hours)', multiplier: 2, key: 'hourly' },
      'half-day': { label: 'Half Day (4 Hours)', multiplier: 1, key: 'halfDay' },
      'full-day': { label: 'Full Day (8 Hours)', multiplier: 1, key: 'fullDay' },
      'multi-day': { label: 'Weekend Explorer (3 Days)', multiplier: 1, key: 'multiDay' }
    };

    function updateSummary() {
      // 1. Vehicle
      let selectedVehKey = 'city-bike';
      bikeTypeRadios.forEach(r => { if (r.checked) selectedVehKey = r.value; });
      const vehData = vehicleCatalog[selectedVehKey] || vehicleCatalog['city-bike'];

      // 2. Duration
      let selectedDurKey = 'full-day';
      durationRadios.forEach(r => { if (r.checked) selectedDurKey = r.value; });
      const durData = durationCatalog[selectedDurKey] || durationCatalog['full-day'];

      // 3. Rental Base Cost
      let baseCost = 0;
      if (durData.key === 'hourly') {
        baseCost = vehData.hourly * durData.multiplier;
      } else if (durData.key === 'halfDay') {
        baseCost = vehData.halfDay;
      } else if (durData.key === 'fullDay') {
        baseCost = vehData.fullDay;
      } else if (durData.key === 'multiDay') {
        baseCost = vehData.multiDay;
      }

      // 4. Extras Cost
      let extrasCost = 0;
      const selectedExtras = [];
      extraCheckboxes.forEach(cb => {
        if (cb.checked) {
          const price = parseFloat(cb.getAttribute('data-price')) || 0;
          extrasCost += price;
          selectedExtras.push({ label: cb.getAttribute('data-label'), price: price });
        }
      });

      // 5. Deposit & Total
      const deposit = vehData.deposit;
      const grandTotal = baseCost + extrasCost + deposit;

      // Update DOM
      if (sumVehicle) sumVehicle.textContent = vehData.name;
      if (sumDuration) sumDuration.textContent = durData.label;
      if (sumDate) {
        const val = pickupDateInput && pickupDateInput.value ? pickupDateInput.value : 'Select Pickup Date';
        sumDate.textContent = val;
      }
      if (sumLocation) {
        const locText = pickupLocSelect && pickupLocSelect.options[pickupLocSelect.selectedIndex] ? pickupLocSelect.options[pickupLocSelect.selectedIndex].text : 'Central Metro Bay 1';
        sumLocation.textContent = locText;
      }

      if (sumExtrasList) {
        if (selectedExtras.length === 0) {
          sumExtrasList.innerHTML = '<span class="text-slate-400 italic">None selected</span>';
        } else {
          sumExtrasList.innerHTML = selectedExtras.map(e => `
            <div class="flex justify-between text-xs py-0.5">
              <span class="text-slate-600 dark:text-slate-300">• ${e.label}</span>
              <span class="font-semibold text-slate-900 dark:text-white">+₹${e.price}</span>
            </div>
          `).join('');
        }
      }

      if (sumRentalPrice) sumRentalPrice.textContent = '₹' + (baseCost + extrasCost);
      if (sumDeposit) sumDeposit.textContent = '₹' + deposit + ' (100% Refundable)';
      if (sumTotal) sumTotal.textContent = '₹' + grandTotal;
    }

    // Bind listeners
    bikeTypeRadios.forEach(r => r.addEventListener('change', updateSummary));
    durationRadios.forEach(r => r.addEventListener('change', updateSummary));
    if (pickupDateInput) pickupDateInput.addEventListener('change', updateSummary);
    if (pickupLocSelect) pickupLocSelect.addEventListener('change', updateSummary);
    extraCheckboxes.forEach(cb => cb.addEventListener('change', updateSummary));

    // Default Date to today + 1
    if (pickupDateInput && !pickupDateInput.value) {
      const d = new Date();
      d.setDate(d.getDate() + 1);
      pickupDateInput.value = d.toISOString().split('T')[0];
    }

    updateSummary();

    // Confirm Booking Action
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      let selectedVehKey = 'city-bike';
      bikeTypeRadios.forEach(r => { if (r.checked) selectedVehKey = r.value; });
      const vehData = vehicleCatalog[selectedVehKey] || vehicleCatalog['city-bike'];

      let selectedDurKey = 'full-day';
      durationRadios.forEach(r => { if (r.checked) selectedDurKey = r.value; });
      const durData = durationCatalog[selectedDurKey] || durationCatalog['full-day'];

      const pickupDate = pickupDateInput ? pickupDateInput.value : 'Tomorrow';
      const locText = pickupLocSelect ? pickupLocSelect.options[pickupLocSelect.selectedIndex].text : 'Central Metro Station';
      const totalAmount = sumTotal ? sumTotal.textContent : '₹1,230';
      const refCode = 'AP-' + Math.floor(100000 + Math.random() * 900000);

      // Render Confirmation Modal
      showBookingConfirmation({
        ref: refCode,
        vehicle: vehData.name,
        date: pickupDate,
        duration: durData.label,
        location: locText,
        total: totalAmount,
        returnDeadline: 'Return within designated duration window at any network hub.'
      });
    });
  }

  // --- 6. Booking Confirmation Modal State ---
  function showBookingConfirmation(details) {
    let modal = document.getElementById('booking-confirmation-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'booking-confirmation-modal';
      modal.className = 'fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in';
      document.body.appendChild(modal);
    }

    modal.innerHTML = `
      <div class="bg-white dark:bg-[#1E293B] text-slate-900 dark:text-white rounded-3xl p-8 max-w-lg w-full border-2 border-amber-500 shadow-2xl space-y-6">
        <div class="text-center space-y-2">
          <div class="w-16 h-16 rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center text-3xl mx-auto font-bold">
            ✓
          </div>
          <span class="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 block">Booking Confirmed</span>
          <h3 class="text-2xl font-extrabold font-heading text-slate-900 dark:text-white">Your Ride Is Reserved!</h3>
          <p class="text-xs text-slate-500 dark:text-slate-400">Confirmation SMS & pickup barcode sent to your mobile phone.</p>
        </div>

        <div class="bg-slate-50 dark:bg-[#0B0F17] p-5 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2.5 text-xs">
          <div class="flex justify-between"><span class="text-slate-500 dark:text-slate-400">Booking Reference:</span> <strong class="font-mono text-sm text-amber-600 dark:text-amber-400">${details.ref}</strong></div>
          <div class="flex justify-between"><span class="text-slate-500 dark:text-slate-400">Reserved Vehicle:</span> <strong>${details.vehicle}</strong></div>
          <div class="flex justify-between"><span class="text-slate-500 dark:text-slate-400">Pickup Date:</span> <strong>${details.date}</strong></div>
          <div class="flex justify-between"><span class="text-slate-500 dark:text-slate-400">Rental Duration:</span> <strong>${details.duration}</strong></div>
          <div class="flex justify-between"><span class="text-slate-500 dark:text-slate-400">Pickup Location:</span> <strong>${details.location}</strong></div>
          <div class="flex justify-between pt-2 border-t border-slate-200 dark:border-slate-700 text-sm font-bold">
            <span>Total Payable Amount:</span>
            <span class="text-amber-600 dark:text-amber-400 text-base">${details.total}</span>
          </div>
          <div class="text-[11px] text-slate-500 dark:text-slate-400 pt-1">
            <strong>Return Protocol:</strong> ${details.returnDeadline}
          </div>
        </div>

        <div class="flex gap-3">
          <button type="button" id="close-modal-btn" class="w-full btn-primary py-3 text-xs font-bold">
            Done &amp; Return to Site
          </button>
        </div>
      </div>
    `;

    document.body.style.overflow = 'hidden';

    const closeBtn = document.getElementById('close-modal-btn');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        modal.remove();
        document.body.style.overflow = '';
        showToast('Booking confirmed! Thank you for choosing AutoPulse.');
      });
    }
  }

  // --- 7. Interactive Real-Time Fare Calculator ---
  function initFareCalculator() {
    const calcForm = document.getElementById('fare-calc-form');
    if (!calcForm) return;

    const distanceSlider = document.getElementById('calc-distance-slider');
    const distanceDisplay = document.getElementById('calc-distance-val');
    const vehicleSelect = document.getElementById('calc-vehicle-type');
    const timeRadioDay = document.getElementById('time-day');
    const timeRadioNight = document.getElementById('time-night');
    const luggageInput = document.getElementById('calc-luggage');
    
    const outTotal = document.getElementById('fare-out-total');
    const outBase = document.getElementById('fare-out-base');
    const outDistFare = document.getElementById('fare-out-distance');
    const outSurcharge = document.getElementById('fare-out-surcharge');
    const outLuggage = document.getElementById('fare-out-luggage');
    const meterDigitFare = document.getElementById('meter-digit-fare');
    const meterDigitKm = document.getElementById('meter-digit-km');
    const meterStatus = document.getElementById('meter-status-tag');

    const vehicleProfiles = {
      cng: { name: 'Standard CNG Auto', baseFare: 30, baseKm: 1.5, perKm: 15, capacity: 3 },
      electric: { name: 'Eco E-Rickshaw', baseFare: 25, baseKm: 1.5, perKm: 13.5, capacity: 3 },
      prime: { name: 'Prime Comfort Auto', baseFare: 35, baseKm: 1.5, perKm: 18, capacity: 3 },
      shared: { name: 'Shared Tempo Feeder', baseFare: 15, baseKm: 3.0, perKm: 4.5, capacity: 6 }
    };

    function calculateFare() {
      const distance = parseFloat(distanceSlider ? distanceSlider.value : 5) || 5;
      const vehicleKey = vehicleSelect ? vehicleSelect.value : 'cng';
      const profile = vehicleProfiles[vehicleKey] || vehicleProfiles.cng;
      const isNight = timeRadioNight ? timeRadioNight.checked : false;
      const luggageCount = parseInt(luggageInput ? luggageInput.value : 0) || 0;

      let baseFare = profile.baseFare;
      let billableKm = Math.max(0, distance - profile.baseKm);
      let distanceCost = billableKm * profile.perKm;
      
      let subtotal = baseFare + distanceCost;
      let nightSurcharge = isNight ? Math.round(subtotal * 0.25) : 0;
      let luggageCost = Math.max(0, luggageCount - 1) * 10;

      let grandTotal = Math.round(subtotal + nightSurcharge + luggageCost);

      if (distanceDisplay) distanceDisplay.textContent = distance.toFixed(1) + ' km';
      if (outTotal) outTotal.textContent = '₹' + grandTotal;
      if (outBase) outBase.textContent = '₹' + baseFare.toFixed(2);
      if (outDistFare) outDistFare.textContent = '₹' + distanceCost.toFixed(2);
      if (outSurcharge) outSurcharge.textContent = isNight ? `+₹${nightSurcharge} (25% Night)` : '₹0.00 (Day Rate)';
      if (outLuggage) outLuggage.textContent = luggageCost > 0 ? `+₹${luggageCost}` : 'Included';

      if (meterDigitFare) meterDigitFare.textContent = String(grandTotal).padStart(3, '0');
      if (meterDigitKm) meterDigitKm.textContent = distance.toFixed(1);
      if (meterStatus) {
        meterStatus.textContent = isNight ? 'NIGHT TARIFF (25%)' : 'HIRED - STANDARD';
        meterStatus.className = isNight ? 'digital-led-amber font-mono text-xs' : 'digital-led-electric font-mono text-xs';
      }
    }

    if (distanceSlider) distanceSlider.addEventListener('input', calculateFare);
    if (vehicleSelect) vehicleSelect.addEventListener('change', calculateFare);
    if (timeRadioDay) timeRadioDay.addEventListener('change', calculateFare);
    if (timeRadioNight) timeRadioNight.addEventListener('change', calculateFare);
    if (luggageInput) luggageInput.addEventListener('input', calculateFare);

    calculateFare();

    const presetSelect = document.getElementById('calc-preset-corridor');
    if (presetSelect) {
      presetSelect.addEventListener('change', (e) => {
        const val = e.target.value;
        if (!val) return;
        const [distStr, fromTo] = val.split('|');
        const d = parseFloat(distStr);
        if (distanceSlider && d) {
          distanceSlider.value = d;
          calculateFare();
          showToast(`Loaded route: ${fromTo} (${d} km)`);
        }
      });
    }
  }

  // --- 8. Simulated WhatsApp Booking (how-to-book.html) ---
  function initWhatsAppSimulator() {
    const chatContainer = document.getElementById('wa-chat-container');
    const presetPills = document.querySelectorAll('.wa-preset-pill');
    if (!chatContainer) return;

    const botResponses = {
      'loc': {
        user: "Share Current Location: MG Road Metro Gate 2",
        bot: "Location received! We found 4 verified AutoPulse drivers within 350 meters. Where would you like to travel?"
      },
      'dest': {
        user: "Drop Location: Indiranagar 100ft Road",
        bot: "Distance: 4.6 km. Fixed Govt Meter Estimate: ₹84 (Standard CNG) / ₹72 (Eco E-Auto). Zero surge guaranteed. Reply 1 to confirm!"
      },
      'confirm': {
        user: "1 - Confirm Auto",
        bot: "Booking Confirmed! Driver Rajesh K. (Badge #DL-1RE-7810) is arriving in 3 mins. OTP: 4892. Live GPS: autopulse.in/t/892a"
      }
    };

    function appendMessage(text, isUser = false) {
      const msgDiv = document.createElement('div');
      msgDiv.className = `flex ${isUser ? 'justify-end' : 'justify-start'} animate-fade-in`;
      
      const bubble = document.createElement('div');
      bubble.className = isUser 
        ? 'bg-amber-500 text-slate-950 font-bold text-xs md:text-sm rounded-2xl rounded-tr-none px-4 py-2.5 max-w-[82%] shadow-sm font-sans'
        : 'bg-white dark:bg-[#1E293B] text-slate-900 dark:text-slate-100 text-xs md:text-sm rounded-2xl rounded-tl-none px-4 py-2.5 max-w-[82%] shadow-sm border border-slate-200 dark:border-slate-700 font-sans';
      
      bubble.innerHTML = text;
      msgDiv.appendChild(bubble);
      chatContainer.appendChild(msgDiv);
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }

    presetPills.forEach(pill => {
      pill.addEventListener('click', () => {
        const step = pill.getAttribute('data-step');
        if (botResponses[step]) {
          appendMessage(botResponses[step].user, true);
          pill.disabled = true;
          pill.classList.add('opacity-40', 'cursor-not-allowed');
          
          setTimeout(() => {
            appendMessage(botResponses[step].bot, false);
          }, 600);
        }
      });
    });
  }

  // --- 9. Driver Verification Lookup (safety.html) ---
  function initDriverVerification() {
    const searchForm = document.getElementById('driver-verify-form');
    const inputField = document.getElementById('driver-verify-input');
    const resultCard = document.getElementById('driver-verify-result');
    const testPills = document.querySelectorAll('.verify-test-pill');
    if (!searchForm || !resultCard) return;

    const mockDatabase = {
      'DL-1RE-7810': {
        name: 'Rajesh Kumar',
        badge: 'DL-RTO-2021-9982',
        rating: '4.9 / 5.0 (1,480 rides)',
        vehicle: 'Mahindra Treo Electric (Green)',
        policeVerified: 'Verified on 14 Jan 2026',
        inspectionStatus: 'A+ (Passed 24-Point Audit)',
        photo: 'assets/images/sections/driver_prosperity.jpg',
        depot: 'Central Metro Hub Bay 1'
      },
      'KA-01-E-2024': {
        name: 'Sunita Sharma',
        badge: 'KA-BENG-8832',
        rating: '4.98 / 5.0 (2,120 rides)',
        vehicle: 'Piaggio Ape E-City (Pink Fleet)',
        policeVerified: 'Verified on 02 Feb 2026',
        inspectionStatus: 'A+ (Women Safety Certified)',
        photo: 'assets/images/sections/safety_driver.jpg',
        depot: 'Indiranagar 100ft Transit Bay'
      },
      'MH-02-ER-1947': {
        name: 'Abdul Rehman',
        badge: 'MH-MUM-4491',
        rating: '4.88 / 5.0 (930 rides)',
        vehicle: 'Bajaj RE EV (Night Patrol)',
        policeVerified: 'Verified on 18 Dec 2025',
        inspectionStatus: 'A+ (Tamper-Proof Meter Validated)',
        photo: 'assets/images/sections/auto.jpg',
        depot: 'Railway Feeder Terminal'
      }
    };

    function performSearch(query, isSilent = false) {
      const cleanQ = query.trim().toUpperCase();
      const match = mockDatabase[cleanQ] || mockDatabase['DL-1RE-7810'];

      resultCard.innerHTML = `
        <div class="p-6 md:p-8 bg-white dark:bg-[#1E293B] rounded-3xl border-2 border-amber-500 shadow-2xl transition-all animate-fade-in">
          <div class="flex flex-col md:flex-row items-center gap-6">
            <div class="relative shrink-0">
              <img src="${match.photo}" alt="${match.name}" class="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover border-4 border-amber-500 shadow-lg">
              <span class="absolute -bottom-2 -right-2 w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-bold shadow">✓</span>
            </div>
            <div class="flex-1 text-center md:text-left space-y-1.5">
              <div class="flex flex-wrap items-center justify-center md:justify-start gap-2">
                <h4 class="text-xl font-extrabold text-slate-900 dark:text-white font-heading">${match.name}</h4>
                <span class="bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5">
                  <svg class="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>
                  POLICE VERIFIED BADGE
                </span>
              </div>
              <p class="text-xs sm:text-sm text-slate-700 dark:text-slate-300"><strong>Badge Number:</strong> <span class="font-mono font-semibold">${match.badge}</span></p>
              <p class="text-xs sm:text-sm text-slate-700 dark:text-slate-300"><strong>Vehicle Plate:</strong> <span class="font-mono font-bold text-amber-600 dark:text-amber-400">${cleanQ}</span> &bull; ${match.vehicle}</p>
              <p class="text-xs sm:text-sm text-slate-700 dark:text-slate-300"><strong>Safety Clearance:</strong> ${match.policeVerified} &bull; ${match.depot}</p>
            </div>
            <div class="text-center md:text-right bg-slate-50 dark:bg-[#0B0F17] p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-700 min-w-[160px] shrink-0">
              <span class="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold tracking-wider block">Rider Rating</span>
              <span class="text-xl font-extrabold text-amber-600 dark:text-amber-400 font-heading block mt-0.5">${match.rating}</span>
              <span class="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 block mt-1">Audit: ${match.inspectionStatus}</span>
            </div>
          </div>
        </div>
      `;
      resultCard.classList.remove('hidden');
      if (!isSilent) {
        showToast(`Verified Police Dossier Loaded for ${cleanQ}`);
      }
    }

    // Initialize with default record
    performSearch('DL-1RE-7810', true);

    searchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (inputField && inputField.value) {
        performSearch(inputField.value);
      }
    });

    testPills.forEach(pill => {
      pill.addEventListener('click', () => {
        const plate = pill.getAttribute('data-plate');
        if (inputField && plate) {
          inputField.value = plate;
          performSearch(plate);
        }
      });
    });
  }

  // --- 9b. Safety 4-Layer Interactive Radar Visualizer ---
  function initSafetyRadarShield() {
    const layerBtns = document.querySelectorAll('.safety-layer-btn');
    const titleEl = document.getElementById('safety-layer-title');
    const descEl = document.getElementById('safety-layer-desc');
    const badgeEl = document.getElementById('safety-layer-badge');
    const spec1El = document.getElementById('safety-spec-1');
    const spec2El = document.getElementById('safety-spec-2');
    const spec3El = document.getElementById('safety-spec-3');
    const statusTextEl = document.getElementById('safety-radar-status-text');

    if (!layerBtns.length || !titleEl) return;

    const layerData = {
      'criminal': {
        title: 'Layer 1: Police Background & Biometric Clearance',
        badge: 'Zero Criminal Record Mandate',
        desc: 'Direct API integration with State Police Control Bureau. Every driver undergoes residential physical address checks, RTO passenger commercial badge validation, and quarterly biometric fingerprint synchronization.',
        spec1: '100% Police Cleared',
        spec2: 'RTO 3+ Yr Commercial Badge',
        spec3: 'Quarterly Biometric Audit',
        status: 'POLICE CLEARANCE: SECURE'
      },
      'telematics': {
        title: 'Layer 2: IoT Telematics & Real-Time Route Shield',
        badge: 'Live Geofence Telemetry',
        desc: 'Continuous GPS stream monitoring from Central Command. Automated route deviation alerts, 1-tap WhatsApp location broadcast without apps, and physical panic buttons hardwired to Dial 112 police dispatch.',
        spec1: '4,800+ Active Streams',
        spec2: '1-Tap WhatsApp Link',
        spec3: '< 6.5 Min SOS Dispatch',
        status: 'TELEMATICS FEED: ACTIVE'
      },
      'structural': {
        title: 'Layer 3: 24-Point Mechanical & Structural Roll-Cage',
        badge: 'Heavy Load Impact Certified',
        desc: 'Every vehicle undergoes 24-point workshop inspection every 30 days: brake shoe calibration, reinforced roll-cage chassis stress tests, high-tread radial tires, all-weather monsoon blinds, and EV battery thermal checks.',
        spec1: '450kg Load Roll Cage',
        spec2: '30-Day Mandatory Audit',
        spec3: 'Grade A+ Certified',
        status: 'STRUCTURAL AUDIT: GRADE A+'
      },
      'pinkfleet': {
        title: 'Layer 4: Dedicated "Pink Auto" Female Safety Fleet',
        badge: 'Women Commuter Safeguards',
        desc: 'Over 180 certified female driver partners operating on dedicated college, hospital, and tech corridors. Automated late-night dispatch prioritization, masked phone numbers, and women safety supervisors on 24/7 hotline.',
        spec1: '180+ Female Drivers',
        spec2: 'Priority Night Dispatch',
        spec3: 'Masked Telephony Numbers',
        status: 'PINK AUTO NETWORK: ONLINE'
      }
    };

    layerBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const layerKey = btn.getAttribute('data-layer');
        const data = layerData[layerKey];
        if (!data) return;

        layerBtns.forEach(b => {
          b.classList.remove('bg-amber-500', 'text-slate-950', 'font-bold', 'shadow-lg', 'shadow-amber-500/30', 'border-amber-500');
          b.classList.add('bg-slate-50', 'dark:bg-[#1E293B]', 'text-slate-900', 'dark:text-white', 'border-slate-200', 'dark:border-slate-700');
        });

        btn.classList.add('bg-amber-500', 'text-slate-950', 'font-bold', 'shadow-lg', 'shadow-amber-500/30', 'border-amber-500');
        btn.classList.remove('bg-slate-50', 'dark:bg-[#1E293B]', 'text-slate-900', 'dark:text-white', 'border-slate-200', 'dark:border-slate-700');

        if (titleEl) titleEl.textContent = data.title;
        if (badgeEl) badgeEl.textContent = data.badge;
        if (descEl) descEl.textContent = data.desc;
        if (spec1El) spec1El.textContent = data.spec1;
        if (spec2El) spec2El.textContent = data.spec2;
        if (spec3El) spec3El.textContent = data.spec3;
        if (statusTextEl) statusTextEl.textContent = data.status;
      });
    });
  }

  // --- 10. Corporate Commute ROI Calculator ---
  function initCorporateCalculator() {
    const empSlider = document.getElementById('corp-emp-slider');
    const empDisplay = document.getElementById('corp-emp-display');
    const shiftsSelect = document.getElementById('corp-shifts');
    const savingsOut = document.getElementById('corp-savings-out');
    const fleetOut = document.getElementById('corp-fleet-out');
    const co2Out = document.getElementById('corp-co2-out');
    const costPerEmpOut = document.getElementById('corp-cost-emp-out');
    if (!empSlider) return;

    function calculateCorporate() {
      const empCount = parseInt(empSlider.value) || 50;
      const shifts = parseInt(shiftsSelect ? shiftsSelect.value : 1) || 1;

      const workingDays = 22;
      const monthlySavings = empCount * 105 * workingDays * (shifts > 1 ? 1.4 : 1);
      const autosNeeded = Math.ceil(empCount / (3 * 3));
      const co2SavedTonnes = ((empCount * 14 * workingDays) / 1000).toFixed(1);
      const monthlySpendPerEmp = (38 * 2 * workingDays).toLocaleString('en-IN');

      if (empDisplay) empDisplay.textContent = empCount + ' Commuters';
      if (savingsOut) savingsOut.textContent = '₹' + Math.round(monthlySavings).toLocaleString('en-IN') + ' / mo';
      if (fleetOut) fleetOut.textContent = autosNeeded + ' Dedicated Electric Autos';
      if (co2Out) co2Out.textContent = co2SavedTonnes + ' Tonnes / mo';
      if (costPerEmpOut) costPerEmpOut.textContent = '₹' + monthlySpendPerEmp + ' / employee';
    }

    empSlider.addEventListener('input', calculateCorporate);
    if (shiftsSelect) shiftsSelect.addEventListener('change', calculateCorporate);
    calculateCorporate();
  }

  // --- 10b. Corporate 4 Modalities Interactive Switcher ---
  function initCorporateModalities() {
    const modBtns = document.querySelectorAll('.corp-modality-btn');
    const titleEl = document.getElementById('mod-active-title');
    const tagEl = document.getElementById('mod-active-tag');
    const descEl = document.getElementById('mod-active-desc');
    const stat1El = document.getElementById('mod-stat-1');
    const stat2El = document.getElementById('mod-stat-2');
    const stat3El = document.getElementById('mod-stat-3');
    const routeTextEl = document.getElementById('mod-route-text');

    if (!modBtns.length || !titleEl) return;

    const modalityData = {
      'metro-loop': {
        title: 'Metro-to-Campus High-Frequency Loop',
        tag: 'Zero Wait Time Transit',
        desc: 'Continuous loop electric autos run between designated Metro Transit stations and your office campus entrance every 3 minutes during peak morning (7:30 - 10:30 AM) and evening (5:00 - 8:30 PM) windows.',
        stat1: 'Every 3 Mins',
        stat2: '100% Zero Wait',
        stat3: 'Dedicated Campus Bay',
        route: 'Route: Metro Amber Line Bay 2 ➔ Tech Boulevard Gate 3 (1.8 km loop)'
      },
      'residential-pool': {
        title: 'Smart Residential Cluster Pooled Commute',
        tag: 'Doorstep Morning Pickup',
        desc: 'Employees living in dense residential clusters are algorithmically grouped into comfortable 3-seater electric auto pools. Direct doorstep pickup eliminates surge pricing and crowded public buses.',
        stat1: '1.5km Catchment Pools',
        stat2: 'Max 3 Colleagues',
        stat3: '45% Cost Reduction',
        route: 'Route: Indiranagar Residency Cluster ➔ Embassy Tech Village (4.2 km direct)'
      },
      'night-escort': {
        title: 'Late-Night Safe Escort & POSH Security Protocols',
        tag: '24/7 Monitored Night Drops',
        desc: 'Mandatory security protocol for staff leaving between 10:00 PM and 5:00 AM. Driver badge verification, real-time control room GPS ping, security doorstep drop confirmation, and emergency panic link.',
        stat1: '100% Doorstep Confirmation',
        stat2: 'Masked Telephony',
        stat3: 'POSH Security Compliant',
        route: 'Route: Campus Departure Deck ➔ Monitored Residential Drop (Central SOS Linked)'
      },
      'campus-internal': {
        title: 'Internal Tech Park & Campus Low-Speed Shuttle',
        tag: 'Campus Zero Emission Mobility',
        desc: 'Dedicated low-speed electric shuttles for moving employees, visitors, executive clients, and catering equipment seamlessly between buildings across expansive 50+ acre corporate campuses.',
        stat1: 'Silent Zero Emission',
        stat2: 'On-Demand Internal Hail',
        stat3: 'Building-to-Building',
        route: 'Route: Building Alpha Lobby ➔ Cafeteria ➔ Executive Boardroom Annex'
      }
    };

    modBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const key = btn.getAttribute('data-mod');
        const data = modalityData[key];
        if (!data) return;

        modBtns.forEach(b => {
          b.classList.remove('bg-amber-500', 'text-slate-950', 'font-bold', 'shadow-md', 'shadow-amber-500/25');
          b.classList.add('bg-white', 'dark:bg-[#1E293B]', 'text-slate-900', 'dark:text-slate-200', 'border-slate-200', 'dark:border-slate-700');
        });

        btn.classList.add('bg-amber-500', 'text-slate-950', 'font-bold', 'shadow-md', 'shadow-amber-500/25');
        btn.classList.remove('bg-white', 'dark:bg-[#1E293B]', 'text-slate-900', 'dark:text-slate-200', 'border-slate-200', 'dark:border-slate-700');

        if (titleEl) titleEl.textContent = data.title;
        if (tagEl) tagEl.textContent = data.tag;
        if (descEl) descEl.textContent = data.desc;
        if (stat1El) stat1El.textContent = data.stat1;
        if (stat2El) stat2El.textContent = data.stat2;
        if (stat3El) stat3El.textContent = data.stat3;
        if (routeTextEl) routeTextEl.textContent = data.route;
      });
    });
  }

  // --- 10c. Enterprise ERP Terminal Billing Console ---
  function initEnterpriseTerminal() {
    const deptBtns = document.querySelectorAll('.erp-dept-btn');
    const deptNameEl = document.getElementById('erp-dept-name');
    const ridesEl = document.getElementById('erp-rides-count');
    const ontimeEl = document.getElementById('erp-ontime-rate');
    const fareEl = document.getElementById('erp-fare-total');
    const gstEl = document.getElementById('erp-gst-total');
    const savingsEl = document.getElementById('erp-savings-total');

    if (!deptBtns.length || !deptNameEl) return;

    const deptData = {
      'all': {
        name: 'All Corporate Departments (Consolidated)',
        rides: '3,420 Completed',
        ontime: '99.85%',
        fare: '₹2,84,500.00',
        gst: '₹14,225.00',
        savings: '₹2,18,000 (43.4% vs Cabs)'
      },
      'engineering': {
        name: 'Engineering & R&D Campus Hub',
        rides: '1,640 Completed',
        ontime: '99.90%',
        fare: '₹1,32,800.00',
        gst: '₹6,640.00',
        savings: '₹1,05,200 (44.2% vs Cabs)'
      },
      'operations': {
        name: '24/7 Operations & Logistics Desk',
        rides: '1,120 Completed',
        ontime: '99.80%',
        fare: '₹95,200.00',
        gst: '₹4,760.00',
        savings: '₹72,400 (43.2% vs Cabs)'
      },
      'night': {
        name: 'Late-Night Safe Escort Roster (POSH)',
        rides: '660 Completed',
        ontime: '100.00%',
        fare: '₹56,500.00',
        gst: '₹2,825.00',
        savings: '₹40,400 (41.7% vs Cabs)'
      }
    };

    deptBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const deptKey = btn.getAttribute('data-dept');
        const data = deptData[deptKey];
        if (!data) return;

        deptBtns.forEach(b => {
          b.classList.remove('bg-amber-500', 'text-slate-950', 'font-bold');
          b.classList.add('bg-slate-800', 'text-slate-300');
        });

        btn.classList.add('bg-amber-500', 'text-slate-950', 'font-bold');
        btn.classList.remove('bg-slate-800', 'text-slate-300');

        if (deptNameEl) deptNameEl.textContent = data.name;
        if (ridesEl) ridesEl.textContent = data.rides;
        if (ontimeEl) ontimeEl.textContent = data.ontime;
        if (fareEl) fareEl.textContent = data.fare;
        if (gstEl) gstEl.textContent = data.gst;
        if (savingsEl) savingsEl.textContent = data.savings;
      });
    });
  }

  // --- 11. Contact & Driver Tabs ---
  function initContactTabs() {
    const tabCustomer = document.getElementById('tab-btn-customer');
    const tabDriver = document.getElementById('tab-btn-driver');
    const formCustomer = document.getElementById('form-pane-customer');
    const formDriver = document.getElementById('form-pane-driver');

    if (!tabCustomer || !tabDriver) return;

    tabCustomer.addEventListener('click', () => {
      tabCustomer.classList.add('active');
      tabDriver.classList.remove('active');
      if (formCustomer) formCustomer.classList.remove('hidden');
      if (formDriver) formDriver.classList.add('hidden');
    });

    tabDriver.addEventListener('click', () => {
      tabDriver.classList.add('active');
      tabCustomer.classList.remove('active');
      if (formDriver) formDriver.classList.remove('hidden');
      if (formCustomer) formCustomer.classList.add('hidden');
    });
  }

  // --- 12. General Form Handlers ---
  function initFormHandlers() {
    const forms = document.querySelectorAll('form:not(#fare-calc-form):not(#driver-verify-form):not(#rental-booking-form)');
    forms.forEach(form => {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const submitBtn = form.querySelector('button[type="submit"]');
        const origText = submitBtn ? submitBtn.innerHTML : 'Submit';

        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.innerHTML = `Submitting...`;
        }

        setTimeout(() => {
          showToast('Request received! Our city transport supervisor will contact you shortly.');
          form.reset();
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = origText;
          }
        }, 800);
      });
    });
  }

  // --- 13. FAQ Accordions ---
  function initFaqAccordions() {
    const faqBtns = document.querySelectorAll('.faq-accordion-btn');
    faqBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const content = btn.nextElementSibling;
        const icon = btn.querySelector('.faq-icon');
        const isOpen = content && !content.classList.contains('hidden');

        const container = btn.closest('.faq-container');
        if (container) {
          container.querySelectorAll('.faq-content').forEach(c => c.classList.add('hidden'));
          container.querySelectorAll('.faq-icon').forEach(i => i.classList.remove('rotate-180'));
        }

        if (!isOpen && content) {
          content.classList.remove('hidden');
          if (icon) icon.classList.add('rotate-180');
        }
      });
    });
  }

  // --- 14. Toast System ---
  function showToast(message) {
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = 'toast-msg';
    toast.textContent = message;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3200);
  }

  // --- 14. Contact Page Interactive Google Map Controller ---
  function initContactInteractiveMap() {
    const mapIframe = document.getElementById('contact-google-map');
    const hubButtons = document.querySelectorAll('.hub-map-btn');
    const titleEl = document.getElementById('map-active-title');
    const tagEl = document.getElementById('map-active-tag');
    const addressEl = document.getElementById('map-active-address');
    const phoneEl = document.getElementById('map-active-phone');
    const hoursEl = document.getElementById('map-active-hours');
    const directionsBtn = document.getElementById('map-directions-btn');
    const copyBtn = document.getElementById('copy-address-btn');

    if (!mapIframe || !hubButtons.length) return;

    const hubData = {
      'central': {
        title: 'Railway Feeder & City Command Hub',
        tag: 'Central Operations Headquarters',
        address: 'Concourse Bay 1, Central Railway Junction, Gandhi Nagar, Bengaluru, Karnataka 560009',
        phone: '1800-419-AUTO (Toll-Free) • 080-2294-8801',
        hours: 'Open 24 Hours / 7 Days a week with active supervisor on duty',
        mapQuery: 'Krantivira+Sangolli+Rayanna+Bengaluru+Station',
        directionsUrl: 'https://maps.google.com/?q=Krantivira+Sangolli+Rayanna+Bengaluru+Station'
      },
      'cyber': {
        title: 'Cyber City Transit Bay & SEZ Feeder',
        tag: 'Tech Park Expressway Feeder',
        address: 'Shuttle Terminal Gate 3, Cyber Gateway Tech Boulevard, Whitefield, Bengaluru 560066',
        phone: '080-2294-8802 • Ext. 104',
        hours: '6:00 AM – 11:30 PM (Daily Commute Shifts)',
        mapQuery: 'ITPL+Main+Road+Whitefield+Bengaluru',
        directionsUrl: 'https://maps.google.com/?q=ITPL+Main+Road+Whitefield+Bengaluru'
      },
      'south': {
        title: 'South Metro Interchange & E-Auto Depot',
        tag: 'Solar EV Swapping Station',
        address: 'Pillar 242, Ring Road Junction, Jayanagar 4th Block South, Bengaluru 560011',
        phone: '080-2294-8803 • Priority Senior Desk',
        hours: 'Open 24 Hours / 7 Days a week',
        mapQuery: 'Jayanagar+4th+Block+Bengaluru',
        directionsUrl: 'https://maps.google.com/?q=Jayanagar+4th+Block+Bengaluru'
      },
      'airport': {
        title: 'Airport Feeder & Highway Flyover Hub',
        tag: '24/7 Night Owl Express Depot',
        address: 'Highway Toll Plaza Flyover Bay 4, North Expressway, Hebbal, Bengaluru 560024',
        phone: '080-2294-8804 • Airport Helpdesk',
        hours: 'Open 24 Hours / 7 Days with dedicated luggage assistance',
        mapQuery: 'Hebbal+Flyover+Bengaluru',
        directionsUrl: 'https://maps.google.com/?q=Hebbal+Flyover+Bengaluru'
      }
    };

    hubButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const hubKey = btn.getAttribute('data-hub');
        const data = hubData[hubKey];
        if (!data) return;

        // Button state classes
        hubButtons.forEach(b => {
          b.classList.remove('bg-amber-500', 'text-slate-950', 'font-bold', 'shadow-sm', 'active');
          b.classList.add('bg-white', 'dark:bg-slate-800', 'text-slate-900', 'dark:text-slate-200');
        });
        btn.classList.add('bg-amber-500', 'text-slate-950', 'font-bold', 'shadow-sm', 'active');
        btn.classList.remove('bg-white', 'dark:bg-slate-800', 'text-slate-900', 'dark:text-slate-200');

        // Update Text Info
        if (titleEl) titleEl.textContent = data.title;
        if (tagEl) tagEl.textContent = data.tag;
        if (addressEl) addressEl.textContent = data.address;
        if (phoneEl) phoneEl.textContent = data.phone;
        if (hoursEl) hoursEl.textContent = data.hours;
        if (directionsBtn) directionsBtn.href = data.directionsUrl;

        // Smooth map update
        mapIframe.src = `https://maps.google.com/maps?q=${data.mapQuery}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
      });
    });

    if (copyBtn && addressEl) {
      copyBtn.addEventListener('click', () => {
        const text = addressEl.textContent.trim();
        navigator.clipboard.writeText(text).then(() => {
          showToast('Address copied to clipboard!');
        }).catch(() => {
          showToast(text);
        });
      });
    }
  }

  // --- Login Modal System ---
  function initLoginModal() {
    let backdrop = document.getElementById('login-modal');
    if (!backdrop) {
      backdrop = document.createElement('div');
      backdrop.id = 'login-modal';
      backdrop.className = 'login-modal-backdrop';
      backdrop.setAttribute('role', 'dialog');
      backdrop.setAttribute('aria-modal', 'true');
      backdrop.setAttribute('aria-label', 'Sign In to AutoPulse');
      backdrop.innerHTML = `
        <div class="login-modal-dialog">
          <!-- Modal Header -->
          <div class="p-6 pb-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div class="flex items-center gap-2.5">
              <div class="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-500 to-amber-600 flex items-center justify-center text-slate-950 font-bold shadow-sm">
                <svg class="w-4 h-4 text-slate-950" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z" />
                </svg>
              </div>
              <div>
                <h3 class="font-heading font-extrabold text-lg text-slate-900 dark:text-white leading-tight">Auto<span class="text-amber-500">Pulse</span> Login</h3>
                <span class="text-[11px] font-semibold text-slate-500 dark:text-slate-400">Choose your account type</span>
              </div>
            </div>
            <button type="button" class="login-modal-close w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-amber-600 flex items-center justify-center transition-colors" aria-label="Close modal">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Role Tabs -->
          <div class="flex border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
            <button type="button" class="login-tab-btn active" data-login-tab="commuter">Commuter</button>
            <button type="button" class="login-tab-btn" data-login-tab="driver">Driver Partner</button>
            <button type="button" class="login-tab-btn" data-login-tab="corporate">Corporate</button>
          </div>

          <!-- Tab Contents -->
          <div class="p-6 space-y-4">
            <!-- Commuter Form -->
            <form id="login-form-commuter" class="login-tab-panel space-y-4">
              <div>
                <label class="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">Mobile Phone Number</label>
                <div class="relative flex items-center">
                  <span class="absolute left-3 font-bold text-xs text-slate-500 dark:text-slate-400">+91</span>
                  <input type="tel" placeholder="Enter 10-digit mobile" maxlength="10" required class="w-full pl-12 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500">
                </div>
              </div>
              <div class="otp-row hidden">
                <label class="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">Enter 4-Digit OTP</label>
                <input type="text" placeholder="1234" maxlength="4" class="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm text-center font-bold tracking-widest text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500">
              </div>
              <button type="submit" class="btn-primary w-full py-2.5 text-center font-bold text-sm shadow-md shadow-amber-500/20">
                <span>Send Verification OTP</span>
              </button>
              <div class="relative flex py-1 items-center">
                <div class="flex-grow border-t border-slate-200 dark:border-slate-700"></div>
                <span class="flex-shrink mx-3 text-[11px] font-semibold text-slate-400">or</span>
                <div class="flex-grow border-t border-slate-200 dark:border-slate-700"></div>
              </div>
              <button type="button" class="w-full py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:border-amber-500 text-xs font-bold text-slate-800 dark:text-white flex items-center justify-center gap-2 transition-all">
                <svg class="w-4 h-4" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/></svg>
                <span>Continue with Google</span>
              </button>
            </form>

            <!-- Driver Form -->
            <form id="login-form-driver" class="login-tab-panel hidden space-y-4">
              <div>
                <label class="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">Captain Mobile or Badge ID</label>
                <input type="text" placeholder="e.g. AP-CAP-9081 or Mobile" required class="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500">
              </div>
              <div>
                <label class="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">4-Digit Security PIN</label>
                <input type="password" placeholder="••••" maxlength="4" required class="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500">
              </div>
              <button type="submit" class="btn-primary w-full py-2.5 text-center font-bold text-sm shadow-md shadow-amber-500/20">
                <span>Captain Partner Sign In</span>
              </button>
              <div class="text-center pt-1">
                <a href="contact.html#driver" class="text-xs font-semibold text-amber-600 dark:text-amber-400 hover:underline">New driver? Register vehicle fleet &rarr;</a>
              </div>
            </form>

            <!-- Corporate Form -->
            <form id="login-form-corporate" class="login-tab-panel hidden space-y-4">
              <div>
                <label class="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">Work Email</label>
                <input type="email" placeholder="name@company.com" required class="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500">
              </div>
              <div>
                <label class="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">Password</label>
                <input type="password" placeholder="••••••••" required class="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500">
              </div>
              <button type="submit" class="btn-primary w-full py-2.5 text-center font-bold text-sm shadow-md shadow-amber-500/20">
                <span>Enterprise Dashboard Sign In</span>
              </button>
              <div class="text-center pt-1">
                <a href="corporate.html" class="text-xs font-semibold text-amber-600 dark:text-amber-400 hover:underline">Request corporate billing account &rarr;</a>
              </div>
            </form>
          </div>
        </div>
      `;
      document.body.appendChild(backdrop);
    }

    function openModal() {
      backdrop.classList.add('active');
      document.body.style.overflow = 'hidden';
      const input = backdrop.querySelector('input:not([type="hidden"])');
      if (input) setTimeout(() => input.focus(), 100);
    }

    function closeModal() {
      backdrop.classList.remove('active');
      document.body.style.overflow = '';
    }

    // Attach open triggers to any .btn-login or a[href="#login"]
    document.querySelectorAll('.btn-login, [data-action="login"], a[href="#login"]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        openModal();
      });
    });

    // Close button & outside click
    const closeBtn = backdrop.querySelector('.login-modal-close');
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) closeModal();
    });

    // Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && backdrop.classList.contains('active')) {
        closeModal();
      }
    });

    // Tab switching
    const tabBtns = backdrop.querySelectorAll('.login-tab-btn');
    const panels = {
      commuter: backdrop.querySelector('#login-form-commuter'),
      driver: backdrop.querySelector('#login-form-driver'),
      corporate: backdrop.querySelector('#login-form-corporate')
    };

    tabBtns.forEach(tab => {
      tab.addEventListener('click', () => {
        tabBtns.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const target = tab.getAttribute('data-login-tab');
        Object.keys(panels).forEach(k => {
          if (panels[k]) {
            panels[k].classList.toggle('hidden', k !== target);
          }
        });
      });
    });

    // Handle submissions
    const commuterForm = backdrop.querySelector('#login-form-commuter');
    if (commuterForm) {
      commuterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const otpRow = commuterForm.querySelector('.otp-row');
        const submitBtn = commuterForm.querySelector('button[type="submit"] span');
        if (otpRow && otpRow.classList.contains('hidden')) {
          otpRow.classList.remove('hidden');
          submitBtn.textContent = 'Verify OTP & Log In';
          showToast('OTP sent: 4829 (Demo code)');
        } else {
          showToast('Welcome back! Logged in as Commuter');
          setTimeout(closeModal, 500);
        }
      });
    }

    const driverForm = backdrop.querySelector('#login-form-driver');
    if (driverForm) {
      driverForm.addEventListener('submit', (e) => {
        e.preventDefault();
        showToast('Welcome Captain! Driver terminal activated');
        setTimeout(closeModal, 500);
      });
    }

    const corporateForm = backdrop.querySelector('#login-form-corporate');
    if (corporateForm) {
      corporateForm.addEventListener('submit', (e) => {
        e.preventDefault();
        showToast('Welcome! Corporate fleet portal logged in');
        setTimeout(closeModal, 500);
      });
    }
  }

  // --- Hero Section Vehicle Showcase Switcher ---
  function initHeroVehicleSwitcher() {
    const stageImg = document.getElementById('hero-stage-img');
    const badgeTitle = document.getElementById('hero-badge-title');
    const badgeCap = document.getElementById('hero-badge-cap');
    const badgeRate = document.getElementById('hero-badge-rate');
    const descName = document.getElementById('hero-desc-name');
    const descText = document.getElementById('hero-desc-text');
    const fareDisplay = document.getElementById('hero-fare-display');
    const rateFormula = document.getElementById('hero-rate-formula');

    if (!stageImg) return;

    const vehicles = {
      cng: {
        title: 'Standard Metered CNG Auto',
        name: 'Classic 3-Wheeler Auto',
        desc: 'Calibrated electronic meter, zero bargaining, doorstep city transit.',
        cap: '3 Passengers',
        ratePill: '₹30 Base • ₹15/km',
        rateFormula: 'Govt RTO Gazette Tariff: ₹30 + ₹15/km',
        estimatedFare: '₹70.50',
        img: 'assets/images/sections/cng_auto.jpg',
        alt: 'Modern yellow and green CNG Auto Rickshaw with digital meter outside metro station'
      },
      electric: {
        title: 'Green E-Rickshaw (EV)',
        name: '100% Electric Eco-Auto',
        desc: 'Silent zero-emission ride, solar battery swap, ideal for neighborhood lanes.',
        cap: '4 Passengers',
        ratePill: '₹25 Base • ₹13.50/km',
        rateFormula: 'Eco Clean Tariff: ₹25 + ₹13.50/km (10% Eco Discount)',
        estimatedFare: '₹61.50',
        img: 'assets/images/sections/e_rickshaw.jpg',
        alt: 'Modern green electric e-rickshaw at clean EV charging transit station'
      },
      shared: {
        title: 'Shared Metro Feeder ("Share-Rick")',
        name: 'High-Frequency Metro Feeder',
        desc: 'Fixed-route shared shuttle every 90 seconds connecting metro bays and hubs.',
        cap: '6 Passengers',
        ratePill: '₹15 Flat Base • ₹4.50/km',
        rateFormula: 'Shared Corridors: ₹15 Flat Base + ₹4.50/km per seat',
        estimatedFare: '₹20.00',
        img: 'assets/images/sections/shared_feeder.jpg',
        alt: 'Shared Metro Feeder Auto Rickshaws lined up outside Metro Station terminal'
      },
      prime: {
        title: 'Prime Comfort Executive Auto',
        name: 'Executive Comfort Cabin',
        desc: 'Plush cushioned leatherette seating, USB mobile fast-charging & spacious boot.',
        cap: '3 Passengers + Luggage',
        ratePill: '₹35 Base • ₹18/km',
        rateFormula: 'Prime Tariff: ₹35 + ₹18/km with Fast USB & AC Airflow',
        estimatedFare: '₹83.50',
        img: 'assets/images/sections/prime_auto.jpg',
        alt: 'Prime Comfort Executive Auto Rickshaw with plush seating and smartphone dock'
      }
    };

    function selectVehicle(key) {
      const data = vehicles[key];
      if (!data) return;

      stageImg.style.opacity = '0.3';
      setTimeout(() => {
        stageImg.src = data.img;
        stageImg.alt = data.alt;
        stageImg.style.opacity = '1';
      }, 120);

      if (badgeTitle) badgeTitle.textContent = data.title;
      if (badgeCap) badgeCap.textContent = data.cap;
      if (badgeRate) badgeRate.textContent = data.ratePill;
      if (descName) descName.textContent = data.name;
      if (descText) descText.textContent = data.desc;
      if (fareDisplay) fareDisplay.textContent = data.estimatedFare;
      if (rateFormula) rateFormula.textContent = data.rateFormula;

      document.querySelectorAll('.hero-vehicle-btn').forEach(b => {
        const isMatch = b.getAttribute('data-hero-vehicle') === key;
        b.classList.toggle('active', isMatch);
        b.classList.toggle('border-2', isMatch);
        b.classList.toggle('border-amber-500', isMatch);
        b.classList.toggle('bg-amber-50', isMatch);
        b.classList.toggle('dark:bg-amber-950/40', isMatch);
      });

      document.querySelectorAll('.hero-thumb-btn').forEach(b => {
        const isMatch = b.getAttribute('data-hero-thumb') === key;
        b.classList.toggle('active', isMatch);
        b.classList.toggle('border-2', isMatch);
        b.classList.toggle('border-amber-500', isMatch);
      });
    }

    document.querySelectorAll('.hero-vehicle-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const key = btn.getAttribute('data-hero-vehicle');
        selectVehicle(key);
      });
    });

    document.querySelectorAll('.hero-thumb-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const key = btn.getAttribute('data-hero-thumb');
        selectVehicle(key);
      });
    });
  }

  window.AutoPulse = {
    showToast: showToast,
    toggleTheme: toggleTheme,
    toggleDirection: toggleDirection
  };

  // --- DOM Ready Init ---
  document.addEventListener('DOMContentLoaded', () => {
    // 1. Immediately kick off Page Loader dismissal so it never hangs
    initPageLoader();

    const safeInit = (fn, name) => {
      try {
        fn();
      } catch (err) {
        console.warn(`[AutoPulse] Module ${name} error:`, err);
      }
    };

    safeInit(initTheme, 'Theme');
    safeInit(initDirection, 'Direction');
    safeInit(initScrollToTop, 'ScrollToTop');
    safeInit(initDesktopDropdowns, 'DesktopDropdowns');
    safeInit(initMobileDrawer, 'MobileDrawer');
    safeInit(initActiveNav, 'ActiveNav');
    safeInit(initLoginModal, 'LoginModal');
    safeInit(initHeroVehicleSwitcher, 'HeroVehicleSwitcher');
    safeInit(initDedicatedBooking, 'DedicatedBooking');
    safeInit(initFareCalculator, 'FareCalculator');
    safeInit(initWhatsAppSimulator, 'WhatsAppSimulator');
    safeInit(initDriverVerification, 'DriverVerification');
    safeInit(initSafetyRadarShield, 'SafetyRadarShield');
    safeInit(initCorporateCalculator, 'CorporateCalculator');
    safeInit(initCorporateModalities, 'CorporateModalities');
    safeInit(initEnterpriseTerminal, 'EnterpriseTerminal');
    safeInit(initContactTabs, 'ContactTabs');
    safeInit(initContactInteractiveMap, 'ContactInteractiveMap');
    safeInit(initFormHandlers, 'FormHandlers');
    safeInit(initFaqAccordions, 'FaqAccordions');

    document.querySelectorAll('.theme-toggle-btn').forEach(btn => {
      btn.addEventListener('click', toggleTheme);
    });
    document.querySelectorAll('.rtl-toggle-btn').forEach(btn => {
      btn.addEventListener('click', toggleDirection);
    });
  });

  // --- Universal Page Preloader Logic ---
  function initPageLoader() {
    const preloader = document.getElementById('page-preloader');
    if (!preloader) return;

    const progressBar = preloader.querySelector('.preloader-progress-bar');
    const statusText = preloader.querySelector('.preloader-status-text');
    let isDismissed = false;

    // Lock page scroll initially
    document.body.classList.add('preloader-locked');

    // Status updates
    const statuses = [
      'Calibrating RTO Gazette Meters',
      'Connecting Urban Transit Hub',
      'Locating Nearby Auto Fleets',
      'Ready to Ride'
    ];

    let statusIndex = 0;
    const statusInterval = setInterval(() => {
      if (isDismissed) {
        clearInterval(statusInterval);
        return;
      }
      statusIndex = (statusIndex + 1) % statuses.length;
      if (statusText) {
        statusText.textContent = statuses[statusIndex];
      }
    }, 450);

    // Dynamic progress bar increments
    if (progressBar) {
      progressBar.style.width = '30%';
      setTimeout(() => {
        if (!isDismissed) progressBar.style.width = '65%';
      }, 180);
      setTimeout(() => {
        if (!isDismissed) progressBar.style.width = '88%';
      }, 420);
    }

    function dismissLoader() {
      if (isDismissed) return;
      isDismissed = true;
      clearInterval(statusInterval);

      if (progressBar) {
        progressBar.style.width = '100%';
      }
      if (statusText) {
        statusText.textContent = 'Welcome to AutoPulse';
      }

      setTimeout(() => {
        preloader.classList.add('fade-out');
        document.body.classList.remove('preloader-locked');

        setTimeout(() => {
          preloader.style.display = 'none';
        }, 600);
      }, 250);
    }

    // Dismiss on window load, DOM ready, or after strict safety timeout
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
      setTimeout(dismissLoader, 200);
    }
    window.addEventListener('load', () => {
      setTimeout(dismissLoader, 100);
    });
    // Strict safety fallback timeout (guarantees preloader never hangs under any condition)
    setTimeout(dismissLoader, 500);

    // Handle browser back/forward cache (bfcache)
    window.addEventListener('pageshow', (event) => {
      dismissLoader();
    });
  }

})();






document.addEventListener("DOMContentLoaded", () => {

  const tabs =
    document.querySelectorAll(".anatomy-tab");

  const contents =
    document.querySelectorAll(".anatomy-content");

  const hotspots =
    document.querySelectorAll(".anatomy-hotspot");

  const currentCounter =
    document.querySelector(".counter-current");

  const progress =
    document.querySelector(".progress-track span");


  if (!tabs.length) return;


  function activateAnatomy(name, index) {

    /* tabs */

    tabs.forEach(tab => {

      tab.classList.toggle(
        "active",
        tab.dataset.anatomy === name
      );

    });


    /* content */

    contents.forEach(content => {

      content.classList.toggle(
        "active",
        content.dataset.content === name
      );

    });


    /* hotspots */

    hotspots.forEach(hotspot => {

      hotspot.classList.toggle(
        "active",
        hotspot.dataset.hotspot === name
      );

    });


    /* counter */

    const number =
      String(index + 1).padStart(2, "0");

    if (currentCounter) {
      currentCounter.textContent = number;
    }


    /* progress */

    if (progress) {

      progress.style.width =
        `${((index + 1) / 4) * 100}%`;

    }

  }


  tabs.forEach((tab, index) => {
    tab.addEventListener("mouseenter", () => {
      activateAnatomy(
        tab.dataset.anatomy,
        index
      );
    });

    tab.addEventListener("click", () => {
      activateAnatomy(
        tab.dataset.anatomy,
        index
      );
    });
  });

});





  document.addEventListener("DOMContentLoaded", () => {

    /* =========================================
       REVEAL OBSERVER
    ========================================= */
    const revealItems = document.querySelectorAll(".reveal");

    const revealObserver = new IntersectionObserver(
      (entries, observer) => {

        entries.forEach((entry) => {

          if (entry.isIntersecting) {

            entry.target.classList.add("active");

            observer.unobserve(entry.target);

          }

        });

      },
      {
        threshold: 0.12
      }
    );

    revealItems.forEach((item) => {
      revealObserver.observe(item);
    });


    /* =========================================
       NUMBER COUNTER
    ========================================= */
    const numbers = document.querySelectorAll(".sla-number");

    const animateNumber = (element) => {

      const target = parseFloat(element.dataset.value);
      const prefix = element.dataset.prefix || "";
      const suffix = element.dataset.suffix || "";

      const duration = 1400;
      const start = performance.now();

      const update = (now) => {

        const progress = Math.min(
          (now - start) / duration,
          1
        );

        // smooth ease-out
        const eased = 1 - Math.pow(1 - progress, 4);

        const value = target * eased;

        if (target % 1 !== 0) {
          element.textContent =
            prefix + value.toFixed(1) + suffix;
        } else {
          element.textContent =
            prefix + Math.round(value) + suffix;
        }

        if (progress < 1) {
          requestAnimationFrame(update);
        }

      };

      requestAnimationFrame(update);
    };


    /* =========================================
       NUMBER OBSERVER
    ========================================= */
    const numberObserver = new IntersectionObserver(
      (entries, observer) => {

        entries.forEach((entry) => {

          if (entry.isIntersecting) {

            animateNumber(entry.target);

            observer.unobserve(entry.target);

          }

        });

      },
      {
        threshold: 0.6
      }
    );

    numbers.forEach((number) => {
      numberObserver.observe(number);
    });


    /* =========================================
       PROGRESS BAR ANIMATION
    ========================================= */
    const progressBars =
      document.querySelectorAll(".sla-progress");

    const progressObserver = new IntersectionObserver(
      (entries, observer) => {

        entries.forEach((entry) => {

          if (entry.isIntersecting) {

            const width =
              entry.target.dataset.width;

            setTimeout(() => {
              entry.target.style.width = width;
            }, 180);

            observer.unobserve(entry.target);

          }

        });

      },
      {
        threshold: 0.5
      }
    );

    progressBars.forEach((bar) => {
      progressObserver.observe(bar);
    });

  });


  
document.addEventListener("DOMContentLoaded", () => {

  const section = document.querySelector(".compact-sla-section");

  if (!section) return;

  const observer = new IntersectionObserver(
    (entries) => {

      entries.forEach((entry) => {

        if (entry.isIntersecting) {

          section.classList.add("is-visible");

          observer.unobserve(section);

        }

      });

    },
    {
      threshold: 0.2
    }
  );

  observer.observe(section);

});
