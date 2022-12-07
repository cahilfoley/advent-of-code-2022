class File {
  constructor(public name: string, public size: number) {}
}

class Directory {
  children: Record<string, Directory | File> = {};

  constructor(public name: string, public parent?: Directory) {}

  private get childrenArray() {
    return Object.values(this.children);
  }

  get childDirectories() {
    return this.childrenArray.filter(
      (child): child is Directory => child instanceof Directory
    );
  }

  get size(): number {
    return this.childrenArray.reduce((total, child) => total + child.size, 0);
  }

  ensureDir(dir: string): Directory {
    if (!(dir in this.children)) {
      this.children[dir] = new Directory(dir, this);
    }

    return this.children[dir] as Directory;
  }

  getAllDirectorySizes(): number[] {
    return [
      this.size,
      ...this.childDirectories.flatMap((dir) => dir.getAllDirectorySizes()),
    ];
  }
}

export const parseCommandsIntoTree = (commands: string[]): Directory => {
  const tree = new Directory("");

  let current = tree;

  for (const line of commands) {
    if (line.startsWith("$")) {
      if (line === "$ cd /") {
        current = tree;
      } else if (line === "$ cd ..") {
        current = current.parent ?? tree;
      } else if (line.startsWith("$ cd ")) {
        current = current.ensureDir(line.slice(5));
      }
    } else if (line.startsWith("dir")) {
      current.ensureDir(line.slice(4));
    } else {
      const [size, filename] = line.split(" ");
      current.children[filename] = new File(filename, +size);
    }
  }

  return tree;
};
