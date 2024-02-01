import os
import sys

output = os.system('spleeter separate -p spleeter:5stems -o /songs/output {}'.format(sys.argv[1]))
print(output, file=sys.stderr)