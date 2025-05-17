import headlinesHandler from '../pages/api/headlines';
import generateFakeHandler from '../pages/api/generate-fake';

describe('/api/headlines', () => {
  it('GET returns a list of headlines (array of strings)', async () => {
    const req = { method: 'GET' } as any;
    let statusCode = 0;
    let jsonData: any = undefined;
    const res = {
      status(code: number) { statusCode = code; return this; },
      json(data: any) { jsonData = data; return this; }
    };
    await headlinesHandler(req, res);
    expect(statusCode).toBe(200);
    expect(Array.isArray(jsonData)).toBe(true);
    expect(typeof jsonData[0]).toBe('string');
  });
});

describe('/api/generate-fake', () => {
  it('POST returns a fake headline for a given real headline', async () => {
    const realHeadline = 'Scientists discover new species in the Amazon rainforest';
    const req = { method: 'POST', body: { realHeadline } } as any;
    let statusCode = 0;
    let jsonData: any = undefined;
    const res = {
      status(code: number) { statusCode = code; return this; },
      json(data: any) { jsonData = data; return this; }
    };
    await generateFakeHandler(req, res);
    expect(statusCode).toBe(200);
    expect(typeof jsonData.fakeHeadline).toBe('string');
    expect(jsonData.fakeHeadline).not.toBe(realHeadline);
  });
}); 