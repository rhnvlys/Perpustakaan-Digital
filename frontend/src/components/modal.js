import { icon } from '../utils/icons.js';
import { escapeHTML } from '../utils/sanitizer.js';

export function renderModal(title, content, onConfirm) {
    return {
        html: `
            <div class="modal-overlay" data-action="close-modal">
                <div class="modal-card" data-modal-content>
                    <div class="modal-header">
                        <h3>${escapeHTML(title)}</h3>
                        <button type="button" class="icon-btn" data-action="close-modal">${icon('close')}</button>
                    </div>
                    <div class="modal-body">${content}</div>
                    <div class="modal-footer">
                        <button type="button" class="button button-secondary" data-action="close-modal">Batal</button>
                        <button type="button" class="button button-primary" data-action="confirm-modal">Konfirmasi</button>
                    </div>
                </div>
            </div>
        `,
        setup: (element) => {
            element.addEventListener('click', (e) => {
                if (e.target.closest('[data-action="close-modal"]')) {
                    element.remove();
                }
                if (e.target.closest('[data-action="confirm-modal"]')) {
                    onConfirm();
                    element.remove();
                }
            });
        }
    };
}