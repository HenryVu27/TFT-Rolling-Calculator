# TFT Rolling Calculator

A web tool to calculate your odds of rolling any unit in Teamfight Tactics (TFT).

**Updated for Set 14**.

## Features
- Find the chance of hitting your desired unit after any number of rolls given your current level and gold, using up-to-date shop odds and pool sizes.

## Demo
![Screenshot](screenshot.png)

## Getting Started

### 1. Clone the Repository
```bash
# HTTPS
git clone https://github.com/yourusername/tft-rolling-calculator.git
cd tft-rolling-calculator
```

### 2. Open the App
Just open `index.html` in your browser. No build step required.

## Credits
- Inspired by TFT stat and guide sites.
- Built with [Chart.js](https://www.chartjs.org/) for visualization.
- Probability calculation logic derived from [wongkj12's explanation](https://github.com/wongkj12).

## Calculation Details

### Probability Calculation
This tool uses a Markov chain model to calculate the probability of obtaining a certain number of copies of a specific unit in TFT, given your current level, gold, and the state of the unit pool. The calculation takes into account:
- Your current level (which determines shop odds for each cost)
- The cost of the unit you are rolling for
- The number of copies of that unit and all units of that cost already out of the pool
- The amount of gold you plan to spend

#### Steps:
1. **Shop Odds**: For your level, the chance of seeing a unit of a given cost in each shop slot is determined by Riot's official shop odds table.
2. **Pool Size**: Each unit has a finite number of copies in the pool, and the pool size for each cost is set by TFT rules.
3. **Markov Chain Model**: The process of rolling is modeled as a Markov chain, where each state represents the number of copies of your target unit you have acquired. The transition matrix is built based on the probability of seeing your unit in each shop slot, considering the current pool state.
4. **Matrix Exponentiation**: The transition matrix is raised to the power corresponding to the number of shop slots you will see (5 per roll, one per 2 gold spent).
5. **Cumulative Probability**: The resulting matrix gives the probability of having at least X copies after spending your gold.

### Gold Requirement Calculation
To determine the minimum gold required for a desired probability (e.g., 80% for 2-star or 3-star):
- The tool iteratively increases the gold amount and recalculates the probability until the threshold is reached.
- For 2-star, it finds the minimum gold such that the probability of getting at least 3 copies is at least 80%.
- For 3-star, it finds the minimum gold such that the probability of getting at least 9 copies is at least 80%.

### Mathematical Details & Assumptions

#### Shop Independence
- **Shop slots are treated as independent draws with replacement.**
- This means the probability of seeing your unit in one shop slot does not affect the probability in another slot within the same roll.
- In real TFT, shop draws are technically without replacement, but the difference is negligible for practical purposes.

#### How to Compute p (Probability of Seeing Your Unit in a Shop Slot)
- Let:
  - C = your unit's cost
  - L = your current level
  - S = shop odds for cost C at level L (as a decimal, e.g. 0.35 for 35%)
  - U = number of copies of your unit left in the pool
  - T = total number of all units of cost C left in the pool
- Then:
  - p = S * (U / T)

#### Equations
- Let S = state vector, where S[k] is the probability of having exactly k copies of your unit.
- Let T = transition matrix, where T[i][j] is the probability of going from i to j copies in one shop slot.

**Probability of seeing your unit in a shop slot:**

![Equation 1: Probability p](equations/eq1.png)

**Transition for one roll (5 slots):**

![Equation 2: State transition](equations/eq2.png)

**Cumulative probability of getting at least n copies (using complement rule):**

![Equation 3: Cumulative probability](equations/eq3.png)

**Gold Requirement:**

![Equation 4: Gold requirement](equations/eq4.png)

*Note: LaTeX equation images will be added to the `/equations/` directory.*
