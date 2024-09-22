import React from 'react';
import Checkbox from '@/component-library/atoms/form/Checkbox';

export const CheckboxCell = (props: { value: boolean }) => {
    return <Checkbox checked={props.value} />;
};

export const checkboxCellWrapperStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
};
