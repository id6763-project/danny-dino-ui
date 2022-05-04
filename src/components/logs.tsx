import { Component } from 'react';
import { Danny } from '../core/danny';
import { Section } from './section';

export interface LogProps {
  logs: string[];
}

export class LogsSection extends Component<LogProps> {
  constructor(props: LogProps) {
    super(props);
  }

  render() {
    return (
      <Section title='Logs'>
        <div className='bg-neutral-900 py-4 mx-4 overflow-y-scroll max-h-96'>
          {this.props.logs?.map((log, index) => (
            <div key={index} className='px-4 py-1 text-neutral-400 text-sm'>
              {log}
            </div>
          ))}
        </div>
      </Section>
    );
  }
}
