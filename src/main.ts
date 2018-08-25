import { Candidate } from './candidate';
import { GeneticAlgorithm } from './genetic-algorithm';

const solution = 'How are you gentleman?';
const GA = new GeneticAlgorithm(500, solution);
var foundSolution: boolean;
for (var i = 0; i < 20000; i++)
{
  foundSolution = GA.computeGeneration();
  if (i % 100 == 0)
  {
    console.log(`Generation ${i}: ${String.fromCharCode(...GA.Population[0].Chromosome)}`);
  }
  if (foundSolution) {
    console.log(`Generation ${i}: ${String.fromCharCode(...GA.Population[0].Chromosome)}`);
    var genPerSec = i / process.uptime();
    console.log(`It took ${i} generations to the solution! ${genPerSec.toFixed(3)} Generations/s`);
    break;
  }
}
