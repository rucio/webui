import { getAtlasAmiTags, getAtlasPandaTaskId, parseAtlasDIDName, parseAtlasVersion } from '@/lib/core/utils/atlas-did-name';

const DATA_RAW = 'data25_13p6TeV.00499912.physics_TLA.merge.RAW';
const DATA_AOD = 'data22_13p6TeV.00437756.physics_Main.merge.AOD.r15869_p6304_tid40703687_00';
const MC_EVNT = 'mc23_5p36TeV.801664.Py8_gammajet_direct_DP17_35_FullSW.merge.EVNT.e8514_e8528_tid44601789_00';
const MC_DAOD = 'mc20_13TeV.830072.H7EG_jetjet_Lund_JZ1.deriv.DAOD_PHYS.e8419_s3681_r13167_r13146_p5855_tid34870879_00';
const DATA_FILE = 'data26_hi.00523138.physics_HardProbes.merge.AOD.f1723_m2281._lb0490._0003.1';
const USER_EMBEDDED = 'user.jdoe.mc23_13p6TeV.601229.x.deriv.DAOD_PHYS.e8514_tid123_00';

describe('parseAtlasDIDName', () => {
    it('parses a data name without Version', () => {
        expect(parseAtlasDIDName(DATA_RAW)).toEqual({
            scheme: 'data',
            project: 'data25_13p6TeV',
            runNumber: '00499912',
            streamName: 'physics_TLA',
            prodStep: 'merge',
            dataType: 'RAW',
        });
    });

    it('parses a data name with AMI tags and a PanDA task', () => {
        expect(parseAtlasDIDName(DATA_AOD)).toEqual({
            scheme: 'data',
            project: 'data22_13p6TeV',
            runNumber: '00437756',
            streamName: 'physics_Main',
            prodStep: 'merge',
            dataType: 'AOD',
            version: { value: 'r15869_p6304', amiTags: ['r15869', 'p6304'], pandaTaskId: '40703687' },
        });
    });

    it('parses an mc name', () => {
        expect(parseAtlasDIDName(MC_DAOD)).toEqual({
            scheme: 'mc',
            project: 'mc20_13TeV',
            datasetNumber: '830072',
            physicsShort: 'H7EG_jetjet_Lund_JZ1',
            prodStep: 'deriv',
            dataType: 'DAOD_PHYS',
            version: { value: 'e8419_s3681_r13167_r13146_p5855', amiTags: ['e8419', 's3681', 'r13167', 'r13146', 'p5855'], pandaTaskId: '34870879' },
        });
    });

    it('parses a valid name as its own scheme', () => {
        expect(parseAtlasDIDName('valid1.123456.ParticleGun_single_mu.recon.AOD.e1234_s5678_tid12345678_00')).toMatchObject({
            scheme: 'valid',
            datasetNumber: '123456',
            physicsShort: 'ParticleGun_single_mu',
            version: { pandaTaskId: '12345678' },
        });
    });

    it('ignores suffix fields after Version on files named after their dataset', () => {
        expect(parseAtlasDIDName(DATA_FILE)).toMatchObject({ scheme: 'data', version: { value: 'f1723_m2281', amiTags: ['f1723', 'm2281'] } });
    });

    it('parses cond names', () => {
        expect(parseAtlasDIDName('cond09_mc.000029.gen.COND')).toEqual({
            scheme: 'cond',
            project: 'cond09_mc',
            internalCondNumber: '000029',
            shortComment: 'gen',
        });
    });

    it('keeps only the user name for user datasets, even with an embedded official name', () => {
        expect(parseAtlasDIDName(USER_EMBEDDED)).toEqual({ scheme: 'user', userName: 'jdoe' });
    });

    it('keeps only the group name for group datasets', () => {
        expect(parseAtlasDIDName('group.phys-higgs.some.analysis.v1')).toEqual({ scheme: 'group', groupName: 'phys-higgs' });
    });

    it.each<[string, string, string, string]>([
        ['DAOD_LLP1.47616532._000665.pool.root.1', 'DAOD_LLP1', '47616532', '000665'],
        ['HITS.51810356._018000.pool.root.1', 'HITS', '51810356', '018000'],
        ['RDO.26849407._021658.pool.root.1', 'RDO', '26849407', '021658'],
        ['log.47616532._000665.job.log.tgz.1', 'log', '47616532', '000665'],
    ])('parses file name %s', (name, dataType, pandaTaskId, jobNumber) => {
        expect(parseAtlasDIDName(name)).toEqual({ scheme: 'file', dataType, pandaTaskId, jobNumber });
    });

    it.each([
        'step14.87488.47741.recon.ESD.70640.58365',
        'data25_13p6TeV.00499912.physics_TLA.merge',
        'cond09_mc.000029.gen.OTHER',
        'a.f1723.b.f1723_m2281',
        'Log.1234._000001.x',
        'HITS.abc._000001.pool.root.1',
        'user',
        'user.',
        'test.file.1',
        '',
    ])('returns null for %p', name => {
        expect(parseAtlasDIDName(name)).toBeNull();
    });
});

describe('parseAtlasVersion', () => {
    it('splits AMI tags from the PanDA suffix and drops the retry counter', () => {
        expect(parseAtlasVersion('e8514_e8528_tid44601789_00')).toEqual({ value: 'e8514_e8528', amiTags: ['e8514', 'e8528'], pandaTaskId: '44601789' });
    });
    it('handles a task-only Version', () => {
        expect(parseAtlasVersion('tid123_00')).toEqual({ value: '', amiTags: [], pandaTaskId: '123' });
    });
    it('de-duplicates tags in order', () => {
        expect(parseAtlasVersion('r1_r1_p2')).toEqual({ value: 'r1_r1_p2', amiTags: ['r1', 'p2'] });
    });
    it('keeps non-tag tokens in value but not in amiTags', () => {
        expect(parseAtlasVersion('r15869_abc')).toEqual({ value: 'r15869_abc', amiTags: ['r15869'] });
    });
    it('is undefined for suffix fields and empty input', () => {
        expect(parseAtlasVersion('_lb0490')).toBeUndefined();
        expect(parseAtlasVersion('')).toBeUndefined();
    });
});

describe('getters', () => {
    it('getAtlasAmiTags reads the Version field only', () => {
        expect(getAtlasAmiTags(MC_DAOD)).toEqual(['e8419', 's3681', 'r13167', 'r13146', 'p5855']);
        expect(getAtlasAmiTags(DATA_RAW)).toEqual([]);
        expect(getAtlasAmiTags(USER_EMBEDDED)).toEqual([]);
        expect(getAtlasAmiTags('DAOD_LLP1.47616532._000665.pool.root.1')).toEqual([]);
    });
    it('getAtlasPandaTaskId reads Version or the file task field', () => {
        expect(getAtlasPandaTaskId(MC_EVNT)).toBe('44601789');
        expect(getAtlasPandaTaskId('HITS.51810356._018000.pool.root.1')).toBe('51810356');
        expect(getAtlasPandaTaskId(DATA_FILE)).toBeUndefined();
        expect(getAtlasPandaTaskId('cond09_mc.000029.gen.COND')).toBeUndefined();
        expect(getAtlasPandaTaskId(USER_EMBEDDED)).toBeUndefined();
    });
});
