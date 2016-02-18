# Webscraper for information on congress' gun voting

This is an Xray web scraper to collect data regarding congressional gun voting.

# Run

Scraping scripts are in the `scrapers` directory. To run one, getBradyRating2009 for example, just type

`node getBradyRating2009.js`

The output will show in the terminal by default. To send it to a file instead, `node getBradyRating2009.js > bradyData2009.json`. On a Mac you can also copy it to the clipboard with `node getBradyRating2009.js pbcopy`