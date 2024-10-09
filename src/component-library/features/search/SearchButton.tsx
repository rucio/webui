import React from 'react';
import { HiPlay, HiStop } from 'react-icons/hi';
import { IconButton } from '@/component-library/features/search/IconButton';
import { cn } from '@/component-library/utils';

interface SearchButtonProps {
    isRunning: boolean;
    onStop: (event: any) => void;
    onSearch: (event: any) => void;
    className?: string;
}

export const SearchButton: React.FC<SearchButtonProps> = ({ isRunning, onSearch, onStop, className }) => {
    return (
        <IconButton
            className={cn('w-full sm:w-48', className)}
            icon={isRunning ? <HiStop className="text-xl" /> : <HiPlay className="text-xl" />}
            onClick={isRunning ? onStop : onSearch}
            variant={isRunning ? 'error' : 'success'}
        >
            {isRunning ? 'Stop' : 'Search'}
        </IconButton>
    );
};
