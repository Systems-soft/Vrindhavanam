// SOUND TOGGLE
document.addEventListener('DOMContentLoaded', () => {
    let soundOn = false;
    const ambientAudio = document.getElementById('ambienceAudio');
    const soundBtn = document.getElementById('soundBtn');

    if (soundBtn && ambientAudio) {
        soundBtn.addEventListener('click', function () {
            soundOn = !soundOn;
            this.textContent = soundOn ? '🔊 Ambience' : '🔇 Ambience';
            if (soundOn) {
                ambientAudio.volume = 0.4;
                ambientAudio.play().catch(() => {
                    if (typeof showToast === 'function') {
                        showToast('Please interact with the page to play sound');
                    }
                    soundOn = false;
                    this.textContent = '🔇 Ambience';
                });
            } else {
                ambientAudio.pause();
            }
            if (typeof showToast === 'function') {
                showToast(soundOn ? 'Ambient sound on' : 'Ambient sound off');
            }
        });
    }
});
