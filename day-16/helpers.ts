import { inspect } from "util";

export class Valve {
  // The hash is a position in a single `1` in a binary encoded number that is unique to the valve.
  // This is summed when including valves in a path and can be used to check if a valve exists in
  // a hash or not
  hash = 0;

  constructor(
    public name: string,
    public rate: number,
    public tunnels: string[],
    public preProcessedTunnels?: Record<string, number>
  ) {}

  [inspect.custom]() {
    return {
      name: this.name,
      to: this.preProcessedTunnels,
      rate: this.rate,
      hash: this.hash,
    };
  }
}

export function parseValves(lines: string[]) {
  const nameRegex = /Valve (?<name>[A-Z]{2}) has flow rate=(?<flowRate>\d+);/;
  const tunnelsRegex = /(?<tunnel>[A-Z]{2})/g;

  // Generate all the valves
  const valves = lines.map((line) => {
    const { name, flowRate } = line.match(nameRegex)?.groups ?? {};
    const tunnels = Array.from(line.matchAll(tunnelsRegex))
      .filter((match) => match.groups?.tunnel !== name)
      .map((match) => match.groups?.tunnel ?? "NFI");
    return new Valve(name, +flowRate, tunnels);
  });

  const valvesLookup: Record<string, Valve> = {};
  let hash = 1;

  for (const valve of valves) {
    valvesLookup[valve.name] = valve;

    if (valve.rate > 0) {
      valve.hash = hash;
      hash *= 2;
    }
  }

  function preProcessValveTunnels(valve: Valve, path = new Set<string>()) {
    if (valve.preProcessedTunnels) return valve.preProcessedTunnels;

    const tunnels: Record<string, number> = {};

    for (const tunnel of valve.tunnels) {
      if (path.has(tunnel)) continue;
      const next = valvesLookup[tunnel];
      const steps =
        next.rate > 0
          ? { [tunnel]: 0 }
          : preProcessValveTunnels(next, new Set([...path, valve.name]));

      for (const [key, value] of Object.entries(steps)) {
        if (key in tunnels) {
          tunnels[key] = Math.min(tunnels[key], value + 1);
        } else {
          tunnels[key] = value + 1;
        }
      }
    }

    delete tunnels[valve.name];

    return tunnels;
  }

  for (const valve of valves) {
    valve.preProcessedTunnels = preProcessValveTunnels(valve);
  }

  return valvesLookup;
}

function getShortestPath(
  valves: Record<string, Valve>,
  openableValves: Valve[]
) {
  function findShortestPath(start: string) {
    const visited: Record<string, number> = {};
    const unvisited: [Valve, number][] = [];
    unvisited.push([valves[start], 0]);

    while (unvisited.length > 0) {
      const [next, steps] = unvisited.shift()!;
      if (next.name in visited) {
        if (steps >= visited[next.name]) {
          continue;
        } else {
          visited[next.name] = steps;
        }
      } else {
        visited[next.name] = steps;
      }

      for (const tunnel in next.preProcessedTunnels) {
        unvisited.push([
          valves[tunnel],
          steps + next.preProcessedTunnels[tunnel],
        ]);
      }
    }

    delete visited[start];
    return visited;
  }

  const shortest: Record<string, Record<string, number>> = {};
  shortest.AA = findShortestPath("AA");
  for (const openableValve of openableValves) {
    shortest[openableValve.name] = findShortestPath(openableValve.name);
  }

  return shortest;
}

export function search(valves: Record<string, Valve>, startTime: number) {
  const openableValves = Object.values(valves).filter((row) => row.rate > 0);
  const shortestPath = getShortestPath(valves, openableValves);

  const score: [number, number][] = [];
  const unvisited: [number, string, number, number][] = [];

  unvisited.push([0, "AA", startTime, 0]);

  while (unvisited.length > 0) {
    const [visited, next, time, released] = unvisited.pop()!;

    for (const valve of openableValves) {
      console.log(
        `${visited.toString(2)} & ${valve.hash.toString(2)} = ${(
          visited & valve.hash
        ).toString(2)}`
      );
      if (visited & valve.hash) continue;

      score.push([visited, released]);
      const distance = shortestPath[next][valve.name];
      const nextTime = time - distance - 1;

      if (nextTime > 0) {
        unvisited.push([
          visited + valve.hash,
          valve.name,
          nextTime,
          released + nextTime * valve.rate,
        ]);
      }
    }
  }

  return score.sort((a, z) => z[1] - a[1]);
}
