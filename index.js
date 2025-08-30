// index.js
// Emergency Service Directory - interaction logic
document.addEventListener('DOMContentLoaded', () => {
  // --- Config / State ---
  let likeCount = 0;
  let copyCount = 0;
  let coins = 100; // initial coins
  let callHistory = []; // will hold { name, number, time }

  // --- Topbar counter elements (likes = left, coins = middle, copy = right) ---
  const topPs = document.querySelectorAll('.top-actions .top1 p');
  const likeCounterEl = topPs[0];   // show likes
  const coinCounterEl = topPs[1];   // show coins
  const copyCounterEl = topPs[2];   // show copies

  function updateTopCounters() {
    if (likeCounterEl) likeCounterEl.innerText = likeCount;
    if (coinCounterEl) coinCounterEl.innerText = coins;
    if (copyCounterEl) copyCounterEl.innerText = copyCount;
  }

  // --- History container ---
  const historyBox = document.querySelector('.history-box');
  function ensureHistoryList() {
    let list = historyBox.querySelector('.history-list');
    if (!list) {
      list = document.createElement('div');
      list.className = 'history-list';
      historyBox.appendChild(list);
    }
    return historyBox.querySelector('.history-list');
  }

  function renderHistory() {
    const list = ensureHistoryList();
    list.innerHTML = '';
    if (callHistory.length === 0) {
      const p = document.createElement('p');
      p.style.color = '#666';
      p.innerText = 'No calls yet.';
      list.appendChild(p);
      return;
    }

    // Render newest first
    callHistory.slice().reverse().forEach(entry => {
      const item = document.createElement('div');
      item.className = 'history-item';
      item.style.display = 'flex';
      item.style.justifyContent = 'space-between';
      item.style.alignItems = 'center';
      item.style.borderBottom = '1px solid #eee';
      item.style.padding = '8px 4px';

      const left = document.createElement('div');
      left.innerHTML = `<strong>${escapeHtml(entry.name)}</strong><div style="font-size:13px">${escapeHtml(entry.number)}</div>`;

      const right = document.createElement('div');
      right.style.textAlign = 'right';
      right.style.fontSize = '12px';
      right.style.color = '#444';
      right.innerText = entry.time;

      item.appendChild(left);
      item.appendChild(right);
      list.appendChild(item);
    });
  }

  // small helper to avoid HTML injection
  function escapeHtml(text) {
    return text
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#039;');
  }

  // --- Clipboard helper ---
  function copyTextToClipboard(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text);
    } else {
      return new Promise((resolve, reject) => {
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed';
        ta.style.left = '-9999px';
        document.body.appendChild(ta);
        ta.focus();
        ta.select();
        try {
          const ok = document.execCommand('copy');
          document.body.removeChild(ta);
          if (ok) resolve();
          else reject(new Error('execCommand copy failed'));
        } catch (err) {
          document.body.removeChild(ta);
          reject(err);
        }
      });
    }
  }

  // --- Attach events to each card ---
  const cards = document.querySelectorAll('.card');
  cards.forEach(card => {
    const favIcon = card.querySelector('.card-fav i');
    const copyBtn = card.querySelector('.btn.copy');
    const callBtn = card.querySelector('.btn.call');

    const nameEl = card.querySelector('.card-body h3');
    const numberEl = card.querySelector('.card-body h1');

    const serviceName = nameEl ? nameEl.innerText.trim() : 'Unknown Service';
    const serviceNumber = numberEl ? numberEl.innerText.trim() : '';

    // Heart click -> increment like count
    if (favIcon) {
      favIcon.style.cursor = 'pointer';
      favIcon.addEventListener('click', () => {
        likeCount += 1;
        favIcon.classList.remove('fa-regular');
        favIcon.classList.add('fa-solid', 'fa-heart');
        updateTopCounters();
      });
    }

    // Copy button -> copy number, alert, increment copy count
    if (copyBtn) {
      copyBtn.addEventListener('click', async () => {
        if (!serviceNumber) {
          alert('No number found to copy.');
          return;
        }
        try {
          await copyTextToClipboard(serviceNumber);
          copyCount += 1;
          updateTopCounters();
          alert(`Hotline copied: ${serviceNumber}`);
        } catch (err) {
          console.error('Copy failed', err);
          alert('Could not copy automatically. Try selecting the number and copying manually.');
        }
      });
    }

    // Call button -> check coins, deduct, add to history
    if (callBtn) {
      callBtn.addEventListener('click', () => {
        if (coins < 20) {
          alert('Not enough coins to make a call. Each call costs 20 coins.');
          return;
        }

        alert(`Calling ${serviceName} at ${serviceNumber} ...`);

        coins -= 20;
        updateTopCounters();

        const now = new Date();
        const timeString = now.toLocaleString(undefined, {
          year: 'numeric',
          month: 'short',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        });

        callHistory.push({
          name: serviceName,
          number: serviceNumber,
          time: timeString
        });

        renderHistory();
      });
    }
  });

  // --- Clear history button ---
  const clearBtn = document.querySelector('.btn-clear');
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      const confirmed = confirm('Are you sure you want to clear the call history?');
      if (!confirmed) return;
      callHistory = [];
      renderHistory();
    });
  }

  // initial render / counters
  updateTopCounters();
  renderHistory();
});
