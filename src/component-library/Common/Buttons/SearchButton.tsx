import React from 'react';
import { HiPlay, HiStop } from 'react-icons/hi';
import { IconButton } from '@/component-library/Common/Buttons/IconButton';

interface SearchButtonProps {
    isRunning: boolean;
    onStop: (event: any) => void;
    onSearch: (event: any) => void;
}

export const SearchButton: React.FC<SearchButtonProps> = ({ isRunning, onSearch, onStop }) => {
    return (
        <IconButton
            className="sm:w-full md:w-48"
            icon={isRunning ? <HiStop className="text-xl" /> : <HiPlay className="text-xl" />}
            onClick={isRunning ? onStop : onSearch}
            variant={isRunning ? 'error' : 'success'}
        >
            {isRunning ? 'Stop' : 'Search'}
        </IconButton>
    );
};
