import struct, pathlib,glob


py_files = glob.glob("*.png")

for py_file in py_files:
  p = pathlib.Path(py_file)

  with p.open('rb') as f:
      sig = f.read(8)
      print('sig', sig)
      chunks=[]
      while True:
          hdr = f.read(8)
          if len(hdr) < 8:
              break
          length, typ = hdr[:4], hdr[4:8]
          n = struct.unpack('>I', length)[0]
          data = f.read(n)
          crc = f.read(4)
          chunks.append((typ.decode('latin1'), n))
          if typ == b'IEND':
              break
      print('chunks', chunks[:20])
      print('eXIf present', any(t=='eXIf' for t,_ in chunks))
      print('EXIF present', any(t=='EXIF' for t,_ in chunks))
