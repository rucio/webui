import {
    DEFAULT_AMI_BASE_URL,
    MAX_AMI_TAGS_PER_REQUEST,
    createAmiApiUrl,
    createAmiTagUrl,
    isAmiTag,
    normalizeAmiBaseUrl,
    parseAmiTags,
    parseAmiTagsParam,
} from '@/lib/core/utils/ami-tag-utils';

describe('parseAmiTags', () => {
    it.each<[string, string[]]>([
        ['data26_hi.00523138.physics_HardProbes.merge.AOD.f1723_m2281._lb0490._0003.1', ['f1723', 'm2281']],
        ['data26_hi.00523138.physics_HardProbes.merge.AOD.f1723_m2281._lb0494._0001.1', ['f1723', 'm2281']],
        [
            'mc23_13p6TeV.601229.PhPy8EG_A14_ttbar_hdamp258p75_SingleLep.deriv.DAOD_PHYS.e8514_s4162_r15540_p6266',
            ['e8514', 's4162', 'r15540', 'p6266'],
        ],
        ['step14.87488.47741.recon.ESD.70640.58365', []],
        ['DAOD_LLP1.47616532._000665.pool.root.1', []],
        ['HITS.51810356._018000.pool.root.1', []],
        ['RDO.26849407._021658.pool.root.1', []],
        ['user.jdoe.mytest.v1', []],
        ['user.jdoe.run2.data.p2', []],
        ['x.f1723_M2281.y', []],
        ['a.f1723.b.f1723_m2281', ['f1723', 'm2281']],
        ['', []],
    ])('%s -> %j', (name, expected) => {
        expect(parseAmiTags(name)).toEqual(expected);
    });
});

describe('isAmiTag', () => {
    it.each(['f1723', 'r15540', 'a100'])('accepts %s', tag => expect(isAmiTag(tag)).toBe(true));
    it.each(['v1', 'p12', 'step14', 'F1723', 'f1723_m2281', '1723', '', ' f1723'])('rejects %p', tag => expect(isAmiTag(tag)).toBe(false));
});

describe('parseAmiTagsParam', () => {
    it('splits, trims, drops blanks and dedupes', () => {
        expect(parseAmiTagsParam(' f1723 ,,m2281,f1723')).toEqual(['f1723', 'm2281']);
    });
    it('joins repeated query keys', () => {
        expect(parseAmiTagsParam(['f1723', 'm2281'])).toEqual(['f1723', 'm2281']);
    });
    it.each<[string | string[] | undefined]>([[undefined], [''], [' , '], ['AOD'], ['f1723,v1']])('returns null for %p', raw => {
        expect(parseAmiTagsParam(raw)).toBeNull();
    });
    it('returns null above the per-request limit', () => {
        const tags = Array.from({ length: MAX_AMI_TAGS_PER_REQUEST + 1 }, (_, i) => `f${1000 + i}`);
        expect(parseAmiTagsParam(tags.join(','))).toBeNull();
    });
    it('accepts exactly the per-request limit', () => {
        const tags = Array.from({ length: MAX_AMI_TAGS_PER_REQUEST }, (_, i) => `f${1000 + i}`);
        expect(parseAmiTagsParam(tags.join(','))).toEqual(tags);
    });
});

describe('AMI URLs', () => {
    it('falls back to the default base URL when blank', () => {
        expect(normalizeAmiBaseUrl(undefined)).toBe(DEFAULT_AMI_BASE_URL);
        expect(normalizeAmiBaseUrl('   ')).toBe(DEFAULT_AMI_BASE_URL);
    });
    it('trims whitespace and trailing slashes', () => {
        expect(normalizeAmiBaseUrl(' https://ami.example.org// ')).toBe('https://ami.example.org');
    });
    it('builds the tagsShow link', () => {
        expect(createAmiTagUrl('https://atlas-ami.cern.ch/', 'm2281')).toBe('https://atlas-ami.cern.ch/?subapp=tagsShow&userdata=m2281');
    });
    it('encodes the tag', () => {
        expect(createAmiTagUrl('https://a.b', 'x&y')).toBe('https://a.b/?subapp=tagsShow&userdata=x%26y');
    });
    it('builds the API URL', () => {
        expect(createAmiApiUrl('https://atlas-ami.cern.ch/')).toBe('https://atlas-ami.cern.ch/AMI2/FrontEnd');
    });
});
