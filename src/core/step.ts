import { Api } from './api';
import { Danny } from './danny';

interface StepInfo {
  id: number;
  name: string;
  operation: string;
  value: string;
  isComplete?: boolean;
  isActive?: boolean;
}

class Step {
  id: number;
  name: string;
  operation: string;
  value: string;
  isComplete?: boolean;
  isActive?: boolean;

  constructor({ id, name, operation, value, isComplete, isActive }: StepInfo) {
    this.id = id;
    this.name = name;
    this.operation = operation;
    this.value = value;
    this.isComplete = isComplete;
    this.isActive = isActive;
  }

  private async audioPlay(url): Promise<void> {
    return new Promise((resolve) => {
      const context = new AudioContext();
      const source = context.createBufferSource();

      fetch(url)
        .then((res) => res.arrayBuffer())
        .then((ArrayBuffer) => context.decodeAudioData(ArrayBuffer))
        .then((audioBuffer) => {
          source.buffer = audioBuffer;
          source.connect(context.destination);
          source.start();

          source.onended = () => resolve();
        });
    });
  }

  private complete() {
    this.isComplete = true;
  }

  execute(danny: Danny) {
    switch (this.operation) {
      case 'play:audio':
        return this.audioPlay(this.value).then(() => this.complete());

      case 'invoke:api':
        return Api.invoke(this.value, { method: 'POST' }).then(() =>
          this.complete()
        );

      case 'wait:until':
        const split = this.value.split(':');
        const valueToValidate = split[split.length - 1];
        const lhs = split.slice(0, split.length - 1);

        return new Promise((resolve) => {
          const getValue = (lhs: string[]) => {
            if (lhs.length === 1) return danny[lhs[0]];
            else if (lhs.length === 2) return danny[lhs[0]][lhs[1]];
            else if (lhs.length === 3)
              return danny[lhs[0]].find(
                (components) => components.id === lhs[1].substring(1)
              )[lhs[2]];
            else return null;
          };

          const waiting = () => {
            if (getValue(lhs) === valueToValidate) {
              resolve({});
            } else {
              console.log(
                'Current Value',
                getValue(lhs),
                'comparing to',
                valueToValidate
              );
              setTimeout(() => waiting(), 300);
            }
          };

          waiting();
        }).then(() => this.complete());

      default:
        return Promise.resolve();
    }
  }
}

export { Step };
