import { Component } from 'react';
import { Danny } from '../core/danny';
import { StepCompletedIcon } from '../core/icons';
import { Step } from '../core/step';
import { Section } from './section';

export interface StepsSectionProps {
  steps: Step[];
  activeStep: number;
  danny: Danny;
}

export class StepsSection extends Component<StepsSectionProps> {
  constructor(props: StepsSectionProps) {
    super(props);
  }

  render() {
    const Output = this.props.steps ? (
      <Section className='flex-1' title='Steps'>
        <div>
          {this.props.steps.map((step, index) => (
            <div key={index} className='py-2'>
              {this.props.activeStep === index ? (
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
      </Section>
    ) : (
      <></>
    );

    return Output;
  }
}
//
