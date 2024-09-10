import { Button, ButtonProps } from '@/component-library/ui/button';
import { cn } from '@/component-library/utils';
import React from 'react';

interface IconButtonProps extends ButtonProps {
    icon: React.ReactElement;
}

export const IconButton: React.FC<IconButtonProps> = ({ icon, className, children, ...props }) => {
    return (
        <Button className={cn('sm:w-48 w-full justify-between', className)} {...props}>
            {children}
            {icon}
        </Button>
    );
};
