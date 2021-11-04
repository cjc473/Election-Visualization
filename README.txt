//github: https://cjc473.github.io/Election-Visualization/ //

//README is out of date as of 10/30/21 - update to follow after project is revisted //

Mavericks and Manchins

Background

“Mavericks and Manchins” is an interactive, bi-directional bar graph of U.S. Senate elections. It shows how well each senator did relative to their state’s partisan lean, i.e. how liberal or conservative their constituents are. Senators at the top of the graph exceeded expectations, while senators at the bottom underperformed. 

Each senator has two overlapping bars - one for their expected margin based on Cook Partisan Voting Index, and the other measuring their actual margin. Those who overperform have bars displayed on the right of the graph, while those who underperform are on the left.

By selecting different years, users can see emerging trends that shape our current congress. While blue state Republicans and red state Democrats were always uncommon, they have become virtually extinct in the 2020 Senate. Users may filter the data by party affiliation or reorder it based on factors like each senator’s age or total campaign donations. 

Features of the project are detailed below in the Functionality & MVP and Bonus Features sections.

Functionality & MVPs

In “Mavericks and Manchins,” users will be able to:
* Select election results from 2008-2020 within a sidebar of years.
* Compare the performance of each senator within an election cycle, with their margin of victory overlaid by their expected result
* Click a senator’s name or bar to display their photo, margin of victory, electorate’s Cook Partisan Voting Index rating, and total campaign funding.
* Toggle the graph between two different modes: one that displays the results for all 33-34 winning senators that specific cycle, and one that shows the top 17 and bottom 17 senator performances within the last 6 years. This allows users to compare all senators vs. just the senators within one specific senate class.
* Filter the results by party affiliation.
* Reorder the results by number of campaign donations, total campaign donations, senators’ age and gender 

In addition, this project will include:

* A production README
* An “about” modal describing what partisan lean is and how it is sourced



Wireframes

![Homepage-2x](https://user-images.githubusercontent.com/75001991/139467530-af115272-a27c-4014-ade4-f3f6340aef31.png)


Technologies, Libraries, APIs
The project will be implemented with the following technologies:

* Javascript, HTML, CSS
* Webpack to bundle and the source JavaScript code
* ProPublica Campaign Finance API, which includes election and candidate data as well as campaign finance
* D3 API to implement bar graph



Implementation Timeline

* Friday Afternoon & Weekend: Setup project. Become familiar with D3 and Propublica APIs. Get bar graph to show up on screen, displaying just the 2020 election data for each senator.
* Monday: Implement the year sidebar, ensuring that the data updates correctly from Propublica.
* Tuesday: Add toggle to see senator stats from past six years rather than that specific election.
* Wednesday: Add options bar to reorder and filter data
* Thursday Morning: deploy to GitHub Pages 

Bonus Features (Optional)

* Provide two additional bars at bottom of screen that represent total campaign funds raised that year and national partisan lean
* Allow user to scroll down the page to select a new year
* Additional options for reordering the graph, including length of tenure
* An additional toggle to see the losing senate candidates that year and how they under/overperformed expected margins