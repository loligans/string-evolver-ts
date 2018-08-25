import { Candidate } from './candidate';
export class GeneticAlgorithm {
  private _Solution: string;
  public Population: Array<Candidate>;
  public Generation: number;
  public MaximumFitness: number;
  public PopulationFitness: number;

  constructor(popSize: number, solution: string) {
    if (popSize % 2 === 1) popSize += 1;
    this._Solution = solution;
    this.Population = this.generatePopulation(popSize);
    this.Generation = 0;
    this.MaximumFitness = solution.length * Candidate.GeneRange;
  }
  private randomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min) + min);
  }
  private generateChromosome(length: number): Buffer {
    // Build the chromosome
    var randomChromosome: string = '';
    var randomGene: number;
    for (var i = 0; i < length; i++)
    {
      randomGene = this.randomInt(Candidate.MinGene, Candidate.MaxGene);
      randomChromosome += String.fromCharCode(randomGene);
    }

    // Returns the chromosome as a buffer
    return Buffer.from(randomChromosome, 'utf8');
  }
  private generatePopulation(popSize: number): Array<Candidate> {
    // Initialize our population and declare chromosome and fitness.
    var population = new Array<Candidate>(popSize);
    var chromosome: Buffer;

    // Fill the population with candidates
    for(var i = 0; i < popSize; i++) {
      chromosome = this.generateChromosome(this._Solution.length);
      population[i] = new Candidate([...chromosome], this._Solution);
      this.PopulationFitness += population[i].Fitness;
    }

    // Sort population by fitness
    population.sort((a, b) => b.Fitness - a.Fitness);
    return population;
  }
  private selectParents(): Array<Candidate> {
    // Initialize the parents collection
    var numParents: number = this.Population.length * .80;
    var parents = new Array<Candidate>();
    
    // Calculate the stochastic interval and starting point
    var interval: number = this.PopulationFitness / numParents;
    var startingPoint = this.randomInt(0, interval);

    // Calculate the points 
    var points = [];
    for (var i = 0; i < numParents; i++) {
      points.push(startingPoint + (i * interval));
    }

    // Stochastic universal sampling
    var fitnessSum: number = 0;
    var index: number;
    for (var p of points) {
      index = 0;
      fitnessSum = 0;
      while (fitnessSum < p) {
        fitnessSum += this.Population[index].Fitness
        index++;
      }
      parents.push(this.Population[index]);
    }
    
    return parents;
  }
  private crossover(parents: Array<Candidate>): Array<Candidate> {
    var children = new Array<Candidate>();
    var parent1: Candidate;
    var parent2: Candidate;
    var crossLocation: number;
    for (var i = 0; i < parents.length; i += 2) {
      // Selects the starting point for crossover
      crossLocation = this.randomInt(1, this._Solution.length);
      parent1 = this.Population[i];
      parent2 = this.Population[i+1];

      // Swap genes and add children
      children.push(
        new Candidate([
          ...parent1.Chromosome.slice(0, crossLocation), 
          ...parent2.Chromosome.slice(crossLocation)
        ], this._Solution), 
        new Candidate([
          ...parent2.Chromosome.slice(0, crossLocation), 
          ...parent1.Chromosome.slice(crossLocation)
        ], this._Solution)
      );
    }

    return children;
  }
  private mutate(children: Array<Candidate>): void {
    // Chance to mutate 1/50 (2%)
    const max: number = 50;
    const min: number = 0;

    var mutate: boolean;
    var location: number;
    for(var child of children) {
      mutate = this.randomInt(min, max) == 0 ? true : false;
      if (mutate) {
        // Mutate the child in random location
        location = this.randomInt(0, this._Solution.length);
        child.Chromosome[location] = this.randomInt(Candidate.MinGene, Candidate.MaxGene);
      }
    }
  }
  private selectSurvivors(): Array<Candidate> {
    const popSize: number = this.Population.length;
    const topPercentCandidates = popSize * .20;
    // Maybe choose a better selection method later on.
    return this.Population.slice(0, topPercentCandidates);
  }
  private sortPopulationFitness() {
    this.PopulationFitness = 0;
    for (var candidate of this.Population) {
      this.PopulationFitness += candidate.Fitness;
    }
    this.Population.sort((a, b) => b.Fitness - a.Fitness);
  }
  public computeGeneration(): boolean {
    // Create the children of the next generation
    var parents = this.selectParents();
    var children = this.crossover(parents);
    this.mutate(children);

    // Determine who makes it to the next generation
    var survivors = this.selectSurvivors();

    // Update the population with the new children and survivors then resort
    this.Population = new Array<Candidate>(...children, ...survivors);
    this.Generation += 1;
    this.sortPopulationFitness();

    // Check for the solution
    var solution = this.Population[0].Fitness >= this.MaximumFitness;

    // Determine if solution was found
    return solution;
  }
}