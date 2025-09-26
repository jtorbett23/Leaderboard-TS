import { genAPIKey } from './apiKey';

describe('genApiKey', () => {
    it('it should generate a string of length 30', async () => {
        const result = genAPIKey();
        expect(result.length).toBe(30);
    });
});
