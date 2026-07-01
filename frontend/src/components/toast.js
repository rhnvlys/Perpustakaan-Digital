import { icon } from '../utils/icons.js';
import { escapeHTML } from '../utils/sanitizer.js';

export function showToast(message) {
    const existing = document.querySelector('.toast');
    if (existing) existing.remove();
    
    const el = document.createElement('div');
    el.className = 'toast';
    el.role = 'status';
    el.innerHTML = `<span class="metric-icon green">${icon('check')}</span><span>${escapeHTML(message)}</span>`;
    document.getElementById('app').appendChild(el);
    
    setTimeout(() => el.remove(), 2800);
}