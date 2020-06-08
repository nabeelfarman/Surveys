import { PNPrimeModule } from './pnprime.module';

describe('PNPrimeModule', () => {
  let pNPrimeModule: PNPrimeModule;

  beforeEach(() => {
    pNPrimeModule = new PNPrimeModule();
  });

  it('should create an instance', () => {
    expect(pNPrimeModule).toBeTruthy();
  });
});
