import { Component } from 'react';
import { Danny } from '../core/danny';
import { LinkSvg, PlaySvg, StopSvg } from '../core/icons';

export interface HeroProps {
  danny: Danny;
  onConnect?: () => void;
  onStart?: () => void;
  onStop?: () => void;
}

export class Hero extends Component<HeroProps> {
  constructor(props: HeroProps) {
    super(props);
  }

  render() {
    const OpButton = !this.props.danny.isConnected ? (
      <button
        className='bg-neutral-700 text-neutral-500 font-bold text-sm rounded-full mx-4 p-4'
        onClick={() => (this.props.onConnect ? this.props.onConnect() : false)}
      >
        {LinkSvg}
      </button>
    ) : this.props.danny.status === 'stopped' ? (
      <button
        className='bg-neutral-700 text-neutral-500 font-bold text-sm rounded-full mx-4'
        onClick={() => (this.props.onStart ? this.props.onStart() : false)}
      >
        {PlaySvg}
      </button>
    ) : (
      <button
        className='bg-neutral-700 text-neutral-500 font-bold text-sm rounded-full mx-4'
        onClick={() => (this.props.onStop ? this.props.onStop() : false)}
      >
        {StopSvg}
      </button>
    );

    const DannyDetails = (
      <div>
        <h1 className='text-6xl text-blue-500 font-bold mb-2'>
          <span className='inline-block flex-1'>{this.props.danny.name}</span>
        </h1>
        <p className='text-2xl font-bold text-neutral-400 ml-1 mb-4'>
          {this.props.danny.description}
        </p>
      </div>
    );

    return (
      <div className='card bg-neutral-800 rounded-md shadow-md p-4 flex py-12'>
        {OpButton}
        {DannyDetails}
      </div>
    );
  }
}
