'use client';
import { ListRSE as ListRSEStory } from "@/component-library/Pages/RSE/ListRSE";
import { mockUseComDOM, fixtureRSEViewModel } from "test/fixtures/table-fixtures";
export default function Page() {
    return (
        <ListRSEStory
            comdom={mockUseComDOM(Array.from({ length: 100 }, () => fixtureRSEViewModel()))} // replace with ViewModel
        />
    )
}
            