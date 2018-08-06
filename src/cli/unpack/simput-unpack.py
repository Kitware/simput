#! /usr/bin/python

import json, os, sys, errno, stat, shutil

def getPath(value):
  if os.path.isabs(value):
    return os.path.normpath(value)
  return os.path.normpath(os.path.join(os.getcwd(), value))

def mkdirp(value):
  try:
    os.makedirs(value)
  except OSError as exc:
    if exc.errno == errno.EEXIST and os.path.isdir(value):
        pass
    else:
        raise

def addExecFlag(value):
  st = os.stat(value)
  os.chmod(value, st.st_mode | stat.S_IEXEC)

def unpack(srcFile, destDirectory):
  with open(srcFile) as simputExport:
    data = json.load(simputExport)
    fileContents = data['results'] if 'results' in data else data
    copies = data['copies'] if 'copies' in data else []
    permissions = data['permissions'] if 'permissions' in data else {}

    # Files

    for name in fileContents:
      fileDest = os.path.join(destDirectory, name)
      destDir = os.path.dirname(fileDest)
      mkdirp(destDir)
      with open(fileDest, 'w+') as out:
        out.write(fileContents[name])

    # Copies

    for entry in copies:
      sourceFile = entry['src']
      destinationFile = os.path.join(destDirectory, entry['dst']);

      mkdirp(os.path.dirname(destinationFile))
      shutil.copyfile(sourceFile, destinationFile)

    # Permissions

    for name in permissions:
      fileDest = os.path.join(destDirectory, name)
      # FIXME we assume the permission edits are to add exec flag
      addExecFlag(fileDest)

if __name__ == "__main__":
  if len(sys.argv) < 3:
    print 'unpack file.json output/directory'
  else:
    unpack(getPath(sys.argv[1]), getPath(sys.argv[2]))
