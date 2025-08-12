// Video Speed Controller Content Script

class VideoSpeedController {
  constructor() {
    this.videos = [];
    this.currentSpeed = 1.0;
    this.init();
  }

  init() {
    this.findVideos();
    this.setupObserver();
    this.setupMessageListener();
  }

  findVideos() {
    this.videos = Array.from(document.querySelectorAll('video'));
    console.log(`Found ${this.videos.length} video(s)`);
  }

  setupObserver() {
    // Watch for dynamically added videos
    const observer = new MutationObserver(() => {
      this.findVideos();
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  setupMessageListener() {
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      if (request.action === 'setSpeed') {
        this.setVideoSpeed(request.speed);
        sendResponse({ success: true, videoCount: this.videos.length });
      } else if (request.action === 'getInfo') {
        sendResponse({ 
          videoCount: this.videos.length, 
          currentSpeed: this.currentSpeed 
        });
      }
    });
  }

  setVideoSpeed(speed) {
    this.currentSpeed = speed;
    this.videos.forEach(video => {
      video.playbackRate = speed;
    });
  }

  getCurrentSpeed() {
    return this.currentSpeed;
  }

  getVideoCount() {
    return this.videos.length;
  }
}

// Initialize the controller
const controller = new VideoSpeedController();

// Export for potential use by popup
window.videoSpeedController = controller;