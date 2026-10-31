import { describe, it, expect } from 'vitest';
import { freePort } from '../../tests/global-setup';

describe('freePort args contract', () => {
  it('calls fuser with -k -n tcp <port>', async () => {
    let calledArgs: string[] = [];
    const mockExec = async (cmd: string, args: string[]) => {
      calledArgs = args;
      return { stdout: 'ok', stderr: '' };
    };
    const ok = await freePort('3450', 1000, mockExec as any);
    expect(ok).toBe(true);
    expect(calledArgs).toEqual(['-k', '-n', 'tcp', '3450']);
  });

  it('returns false when fuser fails', async () => {
    const mockExec = async () => { throw new Error('exit 1'); };
    const ok = await freePort('3450', 1000, mockExec as any);
    expect(ok).toBe(false);
  });
});
