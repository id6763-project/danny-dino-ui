import { Player } from 'tone';

export class AudioPlayer {
  rate: number = 1.0;
  player: Player;

  play(url) {
    return new Promise<void>((resolve) => {
      if (this.player) {
        this.stop();
      }

      this.player = new Player(url).toDestination();
      this.player.playbackRate = this.rate;

      this.player.buffer.onload = () => {
        this.player.start();
        this.player.onstop = () => resolve();
      };
    });
  }

  stop() {
    if (this.player) {
      this.player.stop();
    }
  }
  speedUp(rate = 1.5) {
    this.rate = rate;

    if (this.player) {
      this.player.playbackRate = this.rate;
    }
  }
}

export const audioPlayer = new AudioPlayer();
