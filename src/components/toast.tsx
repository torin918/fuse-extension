import '~styles/toast.css';

import error_svg from '~assets/svg/tips/error.min.svg';
import info_svg from '~assets/svg/tips/info.min.svg';
import success_svg from '~assets/svg/tips/success.min.svg';

export const showToast = (() => {
    const toastContainerId = 'global-toast-container';

    return (message: string, type: 'success' | 'error' | 'info' = 'info', duration = 3000) => {
        let toastContainer = document.getElementById(toastContainerId) as HTMLDivElement;

        if (!toastContainer) {
            toastContainer = document.createElement('div');
            toastContainer.id = toastContainerId;
            document.body.appendChild(toastContainer);
        }

        while (toastContainer.firstChild) {
            toastContainer.firstChild.remove();
        }

        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;

        const text = document.createElement('span');
        text.textContent = message;
        text.className = 'toast-text';

        const icon = document.createElement('img');

        switch (type) {
            case 'success':
                icon.src = success_svg;
                break;
            case 'error':
                icon.src = error_svg;
                break;
            case 'info':
                icon.src = info_svg;
                break;
            default:
                icon.src = info_svg;
                break;
        }
        icon.alt = type;
        icon.className = 'toast-icon';

        toast.appendChild(icon);
        toast.appendChild(text);
        toastContainer.appendChild(toast);

        setTimeout(() => {
            toast.style.height = '50px';
        }, 50);

        setTimeout(() => {
            toast.style.height = '0';
            setTimeout(() => {
                toast.remove();
                if (toastContainer && toastContainer.children.length === 0) {
                    toastContainer.remove();
                }
            }, 300);
        }, duration);
    };
})();
