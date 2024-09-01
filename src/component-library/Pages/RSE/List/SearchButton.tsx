// Define the type for the icon prop
import { Button, ButtonProps } from '@/component-library/ui/button';
import { cn } from '@/component-library/utils';
import React from 'react';

interface SearchButtonProps extends ButtonProps {
    icon: React.ReactElement;
}

export const SearchButton: React.FC<SearchButtonProps> = ({ icon, className, children, ...props }) => {
    return (
        <Button className={cn(className, 'sm:w-48 w-full justify-between')} {...props}>
            {children}
            {icon}
        </Button>
    );
};
