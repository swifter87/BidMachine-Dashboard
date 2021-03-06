import * as React from 'react';
import {ClassAttributes, Component} from 'react';
import {connect} from 'react-redux';
import {Dispatch} from 'redux';
import Select from 'react-select';
import {State} from '../../reducers';
import {SSP} from '../../models/auction/SSP';
import {Field, renderError, simpleValueArray} from '../../lib/form';
import {requestSSPAction} from '../../reducers/SSPSelect';

interface SelectSSPProps extends ClassAttributes<SelectSSPComponent> {
    value?: Array<{
        value: number,
        label: string
    }>;
    onChange?: any;
    onFocus?: any;
    onBlur?: any;
}

interface StateProps {
    loading: boolean;
    sellers: SSP[];
}

interface DispatchProps {
    loadSSP: () => any;
}

export class SelectSSPComponent extends Component<StateProps & DispatchProps & SelectSSPProps, {}> {
    componentDidMount() {
        this.props.loadSSP();
    }

    render() {
        const {value, sellers, loading} = this.props;
        return <Select
            value={value}
            isLoading={loading}
            options={sellers.map(seller => ({
                value: seller.id,
                label: seller.name
            }))}
            multi
            simpleValue
            onChange={this.props.onChange}/>;
    }
}

export const SelectSSP = connect<StateProps, DispatchProps, SelectSSPProps>(
    (state: State) => ({
        loading: state.SSPSelect.loading,
        sellers: state.SSPSelect.sellers.sort((a: SSP, b: SSP) => {
            const [aName, bName] = [a.name.toLowerCase(), b.name.toLowerCase()];
            if (aName < bName) {
                return -1;
            }
            if (aName > bName) {
                return 1;
            }
            return 0;
        })
    }),
    (dispatch: Dispatch<any>) => ({
        loadSSP: () => dispatch(requestSSPAction())
    })
)(SelectSSPComponent);

export function renderSelectSSPField(field: Field) {
    return <div className='form-field'>
        <label>{field.label}</label>
        <SelectSSP
            onBlur={field.input.onBlur}
            value={field.input.value}
            onChange={(value) => {
                const values = simpleValueArray(value);
                if (values.findIndex(val => val === '1') === -1) {
                    values.push('1');
                }
                return field.input
                    .onChange(values
                        .map(v => Number(v))
                    );
            }
            }
        />
        {renderError(field)}
    </div>;
}
