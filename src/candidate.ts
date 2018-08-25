import { GeneticAlgorithm } from './genetic-algorithm';
export class Candidate {
  public static readonly MinGene: number = 32;
  public static readonly MaxGene: number = 127;
  public static readonly GeneRange: number = (Candidate.MaxGene - 1) - Candidate.MinGene;
  private readonly _Solution: string;
  public readonly Chromosome: Array<number>;
  public readonly Fitness: number;

  constructor(chromosome: Array<number>, solution: string) {
    this.Chromosome = chromosome;
    this._Solution = solution;
    this.Fitness = this.calculateFitness();
  }
  private calculateFitness(): number {
    // Start at perfect fitness
    var fitness = Candidate.GeneRange * this._Solution.length;

    // Declare the genes
    var chromosomeGene: number;
    var solutionGene: number;

    // Determine the fitness of every gene
    for (var i = 0; i < this._Solution.length; i++) {
      chromosomeGene = this.Chromosome[i];
      solutionGene = this._Solution.charCodeAt(i);
      fitness -= Math.abs(solutionGene - chromosomeGene);
    }

    return fitness;
  }
}