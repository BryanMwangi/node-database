const rng = require("./rng.js");
const { unsafeStringify } = require("./stringify.js");
const pid = require("../Start/startup.js");

/**
 * NUID V1 - Unix Epoch time-based NUID
   This version of NUID was built following teachings of UID V7 with custom implementation
   of PID which is used to identify the machine that generated the NUID
   
   The PID is generated or obtained from the startup.js that runs upon starting the db.
   Each db server has its own pid that allows each server to be identified in the cluster

   Note, this version of NUID is to be revised thoroughly and frequently
 */

let _seqLow = null;
let _seqHigh = null;
let _msecs = 0;
let _vid = null; // version id

function nuid(options, buf, offset) {
  options = options || {};

  // initialize buffer and pointer
  let i = (buf && offset) || 0;
  const b = buf || new Uint8Array(16);

  // rnds is Uint8Array(16) filled with random bytes
  const rnds = options.random || (options.rng || rng)();

  // milliseconds since unix epoch, 1970-01-01 00:00
  const msecs = options.secs !== undefined ? options.secs : Date.now();

  // initialize the current vid to use. For now it will be v1 since this is the current vid made
  let vid = options.vid ? options.vid : "v1";
  switch (vid) {
    case "v1":
      _vid = 0x01;
      break;
    default:
      _vid = 0x01;
  }

  // initialize local seq high/low parts
  let seqHigh = _seqHigh;
  let seqLow = _seqLow;

  // check if clock has advanced and user has not provided msecs
  if (msecs > _msecs && options.secs === undefined) {
    _msecs = msecs;
  }

  // randomly initialize seq
  if (seqHigh === null || seqLow === null) {
    seqHigh = rnds[6] & 0x7f;
    seqHigh = (seqHigh << 8) | rnds[7];

    seqLow = rnds[8] & 0x3f; // pad for var
    seqLow = (seqLow << 8) | rnds[9];
    seqLow = (seqLow << 5) | (rnds[10] >>> 3);
  }

  // increment seq if within msecs window
  if (msecs + 10000 > _msecs) {
    if (++seqLow > 0x7ffff) {
      seqLow = 0;

      if (++seqHigh > 0xfff) {
        seqHigh = 0;

        // increment internal _msecs. this allows us to continue incrementing
        // while staying monotonic. Note, once we hit 10k milliseconds beyond system
        // clock, we will reset breaking monotonicity (after (2^31)*10000 generations)
        _msecs++;
      }
    }
  } else {
    // resetting; we have advanced more than
    // 10k milliseconds beyond system clock
    _msecs = msecs;
  }

  _seqHigh = seqHigh;
  _seqLow = seqLow;

  // [bytes 0-7] 48 bits of local timestamp
  b[i++] = (_msecs / 0x10000000000) & 0xff;
  b[i++] = (_msecs / 0x100000000) & 0xff;
  b[i++] = (_msecs / 0x1000000) & 0xff;
  b[i++] = (_msecs / 0x10000) & 0xff;
  b[i++] = (_msecs / 0x100) & 0xff;
  b[i++] = _msecs & 0xff;

  // [byte 7] - set 4 bits of version 1
  b[i++] = _vid;

  // [byte 8] - set 8 bits for the pid of the machine in question
  b[i++] = pid;

  // [byte 9-11] - variant (2 bits), first 6 bits seq_low
  b[i++] = ((seqLow >>> 13) & 0x3f) | 0x80;
  b[i++] = (seqLow >>> 5) & 0xff;
  b[i++] = ((seqLow << 3) & 0xff) | (rnds[10] & 0x07);

  // [byte 12-15] - random bytes
  b[i++] = rnds[11];
  b[i++] = rnds[12];
  b[i++] = rnds[13];
  b[i++] = rnds[14];
  b[i++] = rnds[15];

  return unsafeStringify(b); // will revert back to buff || unsafeStringify(b)
}

export default nuid;
