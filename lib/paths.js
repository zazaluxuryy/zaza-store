// Kalıcı veri klasörü. Canlıda DATA_ROOT (ör. Railway volume "/data") verilir →
// veri $DATA_ROOT/data'ya yazılır ve deploy'larda SİLİNMEZ. Yoksa proje/data (local).
// Panel (zaza-collection) ile aynı sözleşme.
import { join } from 'path'

export const DATA_DIR = process.env.DATA_ROOT
  ? join(process.env.DATA_ROOT, 'data')
  : join(process.cwd(), 'data')
