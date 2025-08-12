// Popup Script for Video Speed Controller

class PopupController {
  constructor() {
    this.currentSpeed = 1.0;
    this.videoCount = 0;
    this.init();
  }

  async init() {
    this.setupElements();
    this.setupEventListeners();
    await this.loadCurrentState();
  }

  setupElements() {
    this.speedSlider = document.getElementById('speedSlider');
    this.speedDisplay = document.getElementById('speedDisplay');
    this.videoInfo = document.getElementById('videoInfo');
    this.resetBtn = document.getElementById('resetBtn');
    this.presetBtns = document.querySelectorAll('.preset-btn');
  }

  setupEventListeners() {
    // Speed slider
    this.speedSlider.addEventListener('input', (e) => {
      this.setSpeed(parseFloat(e.target.value));
    });

    // Preset buttons
    this.presetBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const speed = parseFloat(btn.dataset.speed);
        this.setSpeed(speed);
      });
    });

    // Reset button
    this.resetBtn.addEventListener('click', () => {
      this.setSpeed(1.0);
    });
  }

  async loadCurrentState() {
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      const response = await chrome.tabs.sendMessage(tab.id, { action: 'getInfo' });
      
      this.videoCount = response.videoCount;
      this.currentSpeed = response.currentSpeed;
      
      this.updateUI();
    } catch (error) {
      console.error('Error loading current state:', error);
      this.videoInfo.textContent = 'ページを更新してください';
    }
  }

  async setSpeed(speed) {
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      const response = await chrome.tabs.sendMessage(tab.id, { 
        action: 'setSpeed', 
        speed: speed 
      });
      
      if (response.success) {
        this.currentSpeed = speed;
        this.videoCount = response.videoCount;
        this.updateUI();
      }
    } catch (error) {
      console.error('Error setting speed:', error);
    }
  }

  updateUI() {
    // Update speed display
    this.speedDisplay.textContent = `${this.currentSpeed.toFixed(2)}x`;
    
    // Update slider
    this.speedSlider.value = this.currentSpeed;
    
    // Update video info
    if (this.videoCount === 0) {
      this.videoInfo.textContent = '動画が見つかりません';
    } else if (this.videoCount === 1) {
      this.videoInfo.textContent = '1個の動画を制御中';
    } else {
      this.videoInfo.textContent = `${this.videoCount}個の動画を制御中`;
    }
    
    // Update preset button states
    this.presetBtns.forEach(btn => {
      const btnSpeed = parseFloat(btn.dataset.speed);
      if (Math.abs(btnSpeed - this.currentSpeed) < 0.01) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }
}

// Initialize when popup loads
document.addEventListener('DOMContentLoaded', () => {
  new PopupController();
});