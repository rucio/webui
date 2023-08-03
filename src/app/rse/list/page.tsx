'use client';
import { ListRSE as ListRSEStory } from "@/component-library/Pages/RSE/ListRSE";
import { mockUseComDOM, createRSE } from "test/fixtures/table-fixtures";
export default function Page() {
    return (
        <ListRSEStory
            comdom={mockUseComDOM(Array.from({ length: 100 }, () => createRSE()))} // replace with ViewModel
        />
    )
}
            