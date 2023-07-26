'use client';
import { PageRSE as PageRSEStory } from "@/component-library/Pages/RSE/PageRSE";
import { RSEBlockState } from "@/lib/core/entity/rucio";
import { fixtureRSEViewModel, mockUseComDOM } from "test/fixtures/table-fixtures";
import { fixtureRSEProtocolViewModel, fixtureRSEAttributeViewModel } from "test/fixtures/table-fixtures";
export default function Page({ params }: { params: { id: string } }) {
    return (
        <PageRSEStory
            rse={{ ...fixtureRSEViewModel(), id: params.id }}
            rseblockstate={7 as RSEBlockState}
            protocolscomdom={mockUseComDOM(Array.from({ length: 20 }, (_, i) => fixtureRSEProtocolViewModel()))}
            attributescomdom={mockUseComDOM(Array.from({ length: 20 }, (_, i) => fixtureRSEAttributeViewModel()))}
        />
    )
}
