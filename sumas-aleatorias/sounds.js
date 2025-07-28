// Clase para manejar los sonidos de la aplicación
class SoundManager {
    constructor() {
        this.audioContext = null;
        this.isInitialized = false;
        this.volume = 0.3; // Volumen por defecto (30%)
        this.initAudio();
    }

    // Inicializar el contexto de audio
    initAudio() {
        try {
            // Crear contexto de audio
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.isInitialized = true;
            console.log('Audio inicializado correctamente');
        } catch (error) {
            console.log('Audio no disponible:', error);
        }
    }

    // Función para crear un tono
    createTone(frequency, duration, type = 'sine', volume = 1) {
        if (!this.isInitialized || !this.audioContext) return;

        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
        oscillator.type = type;

        // Configurar volumen
        gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(volume * this.volume, this.audioContext.currentTime + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + duration);

        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + duration);
    }

    // Melodía de acierto (acordes ascendentes alegres)
    playCorrectMelody() {
        if (!this.isInitialized) return;

        const now = this.audioContext.currentTime;
        
        // Acorde mayor alegre (Do-Mi-Sol)
        this.createTone(523.25, 0.3, 'sine', 0.8); // Do
        this.createTone(659.25, 0.3, 'sine', 0.6); // Mi
        this.createTone(783.99, 0.3, 'sine', 0.7); // Sol
        
        // Pausa
        setTimeout(() => {
            // Segundo acorde (Fa-La-Do)
            this.createTone(698.46, 0.3, 'sine', 0.8); // Fa
            this.createTone(880.00, 0.3, 'sine', 0.6); // La
            this.createTone(1046.50, 0.3, 'sine', 0.7); // Do
        }, 350);

        // Tercer acorde final (Sol-Si-Re)
        setTimeout(() => {
            this.createTone(783.99, 0.4, 'sine', 0.9); // Sol
            this.createTone(987.77, 0.4, 'sine', 0.7); // Si
            this.createTone(1174.66, 0.4, 'sine', 0.8); // Re
        }, 700);
    }

    // Melodía de error (acordes descendentes suaves)
    playIncorrectMelody() {
        if (!this.isInitialized) return;

        const now = this.audioContext.currentTime;
        
        // Acorde menor suave (La-Do-Mi)
        this.createTone(440.00, 0.4, 'sine', 0.6); // La
        this.createTone(523.25, 0.4, 'sine', 0.5); // Do
        this.createTone(659.25, 0.4, 'sine', 0.4); // Mi
        
        // Pausa
        setTimeout(() => {
            // Segundo acorde descendente (Sol-Si-Re)
            this.createTone(392.00, 0.4, 'sine', 0.6); // Sol
            this.createTone(493.88, 0.4, 'sine', 0.5); // Si
            this.createTone(587.33, 0.4, 'sine', 0.4); // Re
        }, 450);

        // Nota final de cierre
        setTimeout(() => {
            this.createTone(349.23, 0.5, 'sine', 0.7); // Fa
        }, 900);
    }

    // Sonido de clic en botón
    playButtonClick() {
        if (!this.isInitialized) return;
        
        // Sonido corto y agudo
        this.createTone(800, 0.1, 'sine', 0.3);
    }

    // Sonido de nueva operación
    playNewOperation() {
        if (!this.isInitialized) return;
        
        // Secuencia ascendente suave
        this.createTone(523.25, 0.2, 'sine', 0.4); // Do
        setTimeout(() => {
            this.createTone(659.25, 0.2, 'sine', 0.4); // Mi
        }, 200);
        setTimeout(() => {
            this.createTone(783.99, 0.2, 'sine', 0.4); // Sol
        }, 400);
    }

    // Función para cambiar volumen
    setVolume(volume) {
        this.volume = Math.max(0, Math.min(1, volume));
    }

    // Función para activar/desactivar sonido
    toggleSound() {
        if (this.volume > 0) {
            this.volume = 0;
            return false; // Sonido desactivado
        } else {
            this.volume = 0.3;
            return true; // Sonido activado
        }
    }

    // Función para verificar si el audio está disponible
    isAudioAvailable() {
        return this.isInitialized && this.audioContext;
    }
}

// Crear instancia global del manejador de sonidos
const soundManager = new SoundManager();

// Función para activar el audio (necesario en algunos navegadores)
function activateAudio() {
    if (soundManager.audioContext && soundManager.audioContext.state === 'suspended') {
        soundManager.audioContext.resume();
    }
}

// Función para mostrar estado del audio
function getAudioStatus() {
    return {
        available: soundManager.isAudioAvailable(),
        volume: soundManager.volume,
        enabled: soundManager.volume > 0
    };
} 