export interface File {
  name: string;
  size: number;
}

export interface Directory {
  name: string;
  children: (File | Directory)[];
}

export const parseCommandsIntoTree = (commands: string[]): Directory => {
  const tree: Directory = { name: "/", children: [] };
  let path: string[] = [];

  for (const line of commands) {
    const currentDir = getCurrentDir(tree, path);

    if (line.startsWith("$")) {
      if (line === "$ cd /") {
        path = [];
      } else if (line === "$ cd ..") {
        path.pop();
      } else if (/\$ cd .+/.test(line)) {
        const match = /\$ cd (.+)/.exec(line);
        path.push(match![1]);
        // console.log(`Changed into directory ${path.join("/")}`);
      } else {
        // console.log("ls");
      }
    } else if (line.startsWith("dir")) {
      const dir = line.slice(4);
      currentDir.children.push({ name: dir, children: [] });
    } else {
      const [size, filename] = line.split(" ");
      currentDir.children.push({ name: filename, size: +size });
    }
  }

  return tree;
};

export const getCurrentDir = (tree: Directory, path: string[]): Directory => {
  let currentDir = tree;

  for (const folder of path) {
    currentDir = currentDir.children.find(
      (child) => child.name === folder
    ) as Directory;
  }

  return currentDir;
};

export const getSizeForDirectory = (directory: Directory): number => {
  let total = 0;

  for (const child of directory.children) {
    if ("size" in child) {
      total += child.size;
    } else {
      total += getSizeForDirectory(child);
    }
  }

  return total;
};

export const sumDirectoriesLessThanLimit = (
  directory: Directory,
  maxSize: number
) => {
  let total = 0;

  for (const child of directory.children) {
    if ("size" in child) {
    } else {
      const size = getSizeForDirectory(child);
      if (size < maxSize) {
        total += size;
      }
      total += sumDirectoriesLessThanLimit(child, maxSize);
    }
  }

  return total;
};

export const getDirectorySizes = (
  directory: Directory,
  sizes: number[] = []
): number[] => {
  const size = getSizeForDirectory(directory);

  sizes.push(size);

  for (const child of directory.children) {
    if ("size" in child) {
      // meh
    } else {
      getDirectorySizes(child, sizes);
    }
  }

  return sizes;
};
