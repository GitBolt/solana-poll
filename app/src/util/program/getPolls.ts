import * as anchor from '@coral-xyz/anchor'
import { anchorProgram } from '@/util/helper';

export const getPolls = async (
  wallet: anchor.Wallet,
) => {
  const program = anchorProgram(wallet);

  try {
    const data = await program.account.pollAccount.all([
      {
        memcmp: {
          offset: 8 + 4,
          bytes: anchor.utils.bytes.bs58.encode(Uint8Array.from([1])),
        },
      },
    ]);
    return { sig: data, error: false }

  } catch (e: any) {
    console.log(e)
    return { error: e.toString(), sig: null }
  }
}
