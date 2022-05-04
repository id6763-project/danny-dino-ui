import { Component } from 'react';
import { Api } from '../core/api';
import { Section } from './section';

export interface JFComponent {
  name: string;
  type: string;
  operations: { name: string; invoke: string }[];
  state: any;
}

export interface ComponentsSectionProps {
  components: JFComponent[];
}

export class ComponentsSection extends Component<ComponentsSectionProps> {
  constructor(props: ComponentsSectionProps) {
    super(props);
  }

  render() {
    const Output = this.props.components ? (
      <Section className='flex-1' title='Components'>
        <div>
          {this.props.components?.map((component, index) => (
            <div
              key={index}
              className='py-4 px-2 rounded-full bg-neutral-900 mx-4 mb-2'
            >
              <div className='px-4 py-0 flex justify-between'>
                <span className='text-neutral-500 font-bold flex items-center'>
                  {component.name}
                  {component.type === 'bone' ? (
                    component.state.isActive ? (
                      <span className='bg-green-700 text-green-100 px-2 py-1 rounded-full font-bold text-[0.6em] ml-2'>
                        ACTIVE
                      </span>
                    ) : (
                      <>
                        <span className='bg-red-700 text-red-100 px-2 py-1 rounded-full font-bold text-[0.6em] ml-2'>
                          INACTIVE
                        </span>
                      </>
                    )
                  ) : (
                    <></>
                  )}

                  {component.state && component.state.length ? (
                    <span className='border-green-700 border-1 bg-green-200 text-green-900 px-2 py-1 rounded-full font-bold text-[0.6em] ml-2'>
                      {component.state}
                    </span>
                  ) : (
                    <></>
                  )}
                </span>

                <div className='flex items-center'>
                  {component.operations?.map((op, index) => (
                    <button
                      className='bg-neutral-600 text-neutral-200 text-[0.6em] max-w-20 px-2 py-1 ml-2 rounded-md'
                      key={index}
                      onClick={() => Api.invoke(op.invoke, { method: 'POST' })}
                    >
                      {op.name}
                    </button>
                  ))}
                </div>
              </div>
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
