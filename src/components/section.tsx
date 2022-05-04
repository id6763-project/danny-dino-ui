import { Component, JSXElementConstructor } from 'react';

export type SectionProps = {
  title: string;
  children: JSX.Element;
  className?: string;
};

export interface SectionState {}

export class Section extends Component<SectionProps, SectionState> {
  constructor(props: SectionProps) {
    super(props);
  }

  render() {
    return (
      <div
        className={`bg-neutral-800 rounded-md shadow-md pb-4 mr-4 mt-4 last:mr-0 ${this.props.className}`}
      >
        <h1 className='text-2xl font-bold text-neutral-400 mb-2 uppercase p-4'>
          {this.props.title}
        </h1>

        <div>{this.props.children}</div>
      </div>
    );
  }
}
