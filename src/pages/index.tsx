import Head from 'next/head';
import { Component } from 'react';

type Step = {
  id: number;
  name: string;
  operation: string;
  value: string;
  isComplete?: boolean;
};

export default class Home extends Component<
  {},
  {
    danny: {
      name?: string;
      description?: string;
      status?: string;
      isConnected?: boolean;
      components?: any[];
      logs?: string[];
    };
    setup: { steps: Step[] };
    activeStep?: number;
  }
> {
  apiBase = 'http://localhost:3000/api/v1';
  constructor(props) {
    super(props);

    this.state = {
      danny: {},
      setup: {
        steps: [],
      },
    };
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

  startPolling() {
    const poll = () => {
      fetch(`${this.apiBase}/danny`)
        .then((res) => res.json())
        .then((danny) => {
          this.setState({ danny });
          setTimeout(() => poll(), 500);
        });
    };

    poll();
  }

  connectToInstallation() {
    this.startPolling();

    fetch(`${this.apiBase}/danny/connect`, { method: 'POST' }).then(() =>
      this.startInstallation()
    );
  }

  executeStep(step: Step): Promise<void> {
    const completeStep = (step: Step) => {
      step.isComplete = true;
    };

    switch (step.operation) {
      case 'play:audio':
        return this.audioPlay(step.value).then(() => completeStep(step));

      case 'invoke:api':
        return fetch(`${this.apiBase}${step.value}`, { method: 'POST' })
          .then((res) => res.json())
          .then(() => completeStep(step));

      case 'wait:until':
        const split = step.value.split(':');
        const valueToValidate = split[split.length - 1];
        const lhs = split.slice(0, split.length - 1);

        return new Promise((resolve) => {
          const getValue = (lhs: string[]) => {
            if (lhs.length === 1) return this.state['danny'][lhs[0]];
            else if (lhs.length === 2)
              return this.state['danny'][lhs[0]][lhs[1]];
            else if (lhs.length === 3)
              return this.state['danny'][lhs[0]].find(
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
        }).then(() => completeStep(step));

      default:
        return Promise.resolve();
    }
  }

  startInstallation() {
    const processStep = (index: number) => {
      const { setup } = this.state;
      this.setState({
        activeStep: index,
      });
      const currentStep = setup.steps[index];

      if (!currentStep) {
        return;
      }

      this.executeStep(currentStep).then(() => processStep(index + 1));
    };

    processStep(0);
  }

  pauseInstallation() {}

  invokeApi(url) {
    return fetch(`${this.apiBase}${url}`, { method: 'POST' });
  }

  componentDidMount() {
    fetch(`${this.apiBase}/danny`)
      .then((res) => res.json())
      .then((danny) => this.setState({ danny }));

    fetch(`${this.apiBase}/danny/setup`)
      .then((res) => res.json())
      .then((setup) =>
        this.setState({
          setup,
          activeStep: 0,
        })
      );
  }

  render() {
    const { danny, setup } = this.state;

    const PlaySvg = (
      <svg
        xmlns='http://www.w3.org/2000/svg'
        className='h-28 w-28'
        viewBox='0 0 20 20'
        fill='currentColor'
      >
        <path
          fillRule='evenodd'
          d='M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z'
          clipRule='evenodd'
        />
      </svg>
    );

    const PauseSvg = (
      <svg
        xmlns='http://www.w3.org/2000/svg'
        className='h-28 w-28'
        viewBox='0 0 20 20'
        fill='currentColor'
      >
        <path
          fillRule='evenodd'
          d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z'
          clipRule='evenodd'
        />
      </svg>
    );

    const StopSvg = (
      <svg
        xmlns='http://www.w3.org/2000/svg'
        className='h-8 w-8'
        viewBox='0 0 20 20'
        fill='currentColor'
      >
        <path
          fillRule='evenodd'
          d='M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z'
          clipRule='evenodd'
        />
      </svg>
    );

    const RestartSvg = (
      <svg
        xmlns='http://www.w3.org/2000/svg'
        className='h-8 w-8'
        viewBox='0 0 20 20'
        fill='currentColor'
      >
        <path
          fillRule='evenodd'
          d='M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z'
          clipRule='evenodd'
        />
      </svg>
    );

    const StepCompletedIcon = (
      <svg
        xmlns='http://www.w3.org/2000/svg'
        className='h-5 w-5'
        viewBox='0 0 20 20'
        fill='currentColor'
      >
        <path
          fillRule='evenodd'
          d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
          clipRule='evenodd'
        />
      </svg>
    );

    return (
      <div>
        <Head>
          <title>Danny The Dinosaur</title>
          <meta name='description' content='Generated by create next app' />
          <link rel='icon' href='/favicon.ico' />
        </Head>
        <div className='page w-3/4 mx-auto mt-16'>
          <div className='main'>
            <div className='card bg-neutral-800 rounded-md shadow-md p-4 flex py-12'>
              <div>
                {danny.isConnected ? (
                  <>
                    <div className='relative'>
                      <span className='flex items-center'>
                        {this.state.activeStep >= 0 ? (
                          this.state.danny.status === 'started' ? (
                            <button
                              className='bg-neutral-700 text-2xl text-neutral-500 font-bold text-sm rounded-full mx-4'
                              onClick={() => this.pauseInstallation()}
                            >
                              {PauseSvg}
                            </button>
                          ) : (
                            <button
                              className='bg-neutral-700 text-2xl text-neutral-500 font-bold text-sm rounded-full mx-4'
                              onClick={() => this.startInstallation()}
                            >
                              {PlaySvg}
                            </button>
                          )
                        ) : (
                          <></>
                        )}
                      </span>

                      {danny.status === 'started' ? (
                        <div className='absolute bottom-[5%] left-[-4em] flex flex-col'>
                          <button
                            className='bg-red-400 text-2xl text-red-200 font-bold text-sm rounded-full p-1 mb-2'
                            onClick={() => this.startInstallation()}
                          >
                            {StopSvg}
                          </button>
                          <button
                            className='bg-green-600 text-2xl text-green-800 font-bold text-sm rounded-full p-1'
                            onClick={() => this.startInstallation()}
                          >
                            {RestartSvg}
                          </button>
                        </div>
                      ) : (
                        <></>
                      )}
                    </div>
                  </>
                ) : (
                  <>
                    <span className='flex items-center'>
                      <button
                        className='bg-neutral-700 text-2xl text-neutral-500 font-bold text-sm rounded-full mx-4'
                        onClick={() => this.connectToInstallation()}
                      >
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          className='h-28 w-28'
                          viewBox='0 0 20 20'
                          fill='currentColor'
                        >
                          <path
                            fillRule='evenodd'
                            d='M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z'
                            clipRule='evenodd'
                          />
                        </svg>
                      </button>
                    </span>
                  </>
                )}
              </div>

              <div>
                <h1 className='text-6xl text-blue-500 font-bold mb-2'>
                  <span className='inline-block flex-1'>{danny.name}</span>
                </h1>
                <p className='text-2xl font-bold text-neutral-400 ml-1 mb-4'>
                  {danny.description}
                </p>
              </div>
            </div>
          </div>

          <div className='grid grid-cols-2 grid-rows-1 mt-4'>
            <div className='pr-2'>
              <div className='bg-neutral-800 rounded-md shadow-md pb-4'>
                <h1 className='text-2xl font-bold text-neutral-400 mb-2 uppercase p-4'>
                  Components
                </h1>
                <div className='grid'>
                  {danny.components?.map((component, index) => (
                    <div
                      key={index}
                      className='py-4 px-2 rounded-full bg-neutral-900 mx-4 mb-2'
                    >
                      <div className='px-4 py-0 flex justify-between'>
                        <span className='text-neutral-500 font-bold'>
                          {component.name}
                        </span>

                        <div className='flex'>
                          {component.operations?.map((op, index) => (
                            <button
                              className='bg-neutral-100 text-[0.5em] w-16 ml-4 rounded-md'
                              key={index}
                              onClick={() => this.invokeApi(op.invoke)}
                            >
                              {op.name}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className='side pl-2'>
              <div className='bg-neutral-800 rounded-md shadow-md'>
                <h1 className='text-2xl font-bold text-neutral-400 mb-2 uppercase p-4'>
                  Steps
                </h1>
                {setup.steps.map((step, index) => (
                  <div key={index} className='py-2'>
                    {this.state.activeStep === index &&
                    danny.status === 'started' ? (
                      <div className='bg-neutral-700 text-neutral-100 py-4 px-4'>
                        <div className='loader'></div>
                        <span className='font-bold'>{step.name}</span>
                      </div>
                    ) : (
                      <div className='px-4 py-0 flex items-center'>
                        {step.isComplete ? (
                          <span className='text-neutral-400'>
                            {StepCompletedIcon}
                          </span>
                        ) : (
                          <></>
                        )}
                        <span className='text-neutral-400'>
                          <span className='ml-2'>{step.name}</span>
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className='logger mt-4'>
            <div className='bg-neutral-800 rounded-md shadow-md p-4'>
              <>
                <h1 className='text-2xl font-bold text-neutral-400 mb-2 uppercase pb-4'>
                  LOGS
                </h1>

                <div className='bg-neutral-900 py-4 px-0'>
                  {this.state.danny.logs?.map((log, index) => (
                    <div
                      key={index}
                      className='px-4 py-1 text-neutral-400 text-sm'
                    >
                      {log}
                    </div>
                  ))}
                </div>
              </>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
