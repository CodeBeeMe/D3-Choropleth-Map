/* !Date:23.10.2018 Copyright ©2018 JavaScript & React code by Cătălin Anghel-Ursu @Madness2aMaze (https://codepen.io/Madness2aMaze)
- All Rights Reserved!

MIT License

Copyright (c) 2018 Cătălin Anghel-Ursu (https://github.com/Madness2aMaze/D3-Choropleth-Map)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE. */

window.onload = () => {
  
  d3
    .select(".container-fluid")
    .append("div")
    .attr("id", "title")
    .append("div")
    .attr("id", "logo")
    .append("h1")
    .attr("id", "dee")
    .text("D");

  d3
    .select("#logo")
    .append("h1")
    .attr("id", "three")
    .text("3");

  d3
    .select("#title")
    .append("h3")
    .attr("id", "subT")
    .text("CHOROPLETH");

  d3
    .select("#title")
    .append("h3")
    .attr("id", "subB")
    .text("MAP");

  d3
    .select(".container-fluid")
    .append("div")
    .attr("id", "chart")
    .append("h1")
    .attr("id", "chart-title")
    .attr("class", "text-grad-dark-to-light-to-dark")
    .text("United States Educational Attainment");

  d3
    .select("#chart")
    .append("h6")
    .attr("id", "description")
    .text(
    "Percentage of adults age 25 and older with a bachelor's degree or higher (2010-2014)"
  );

  d3
    .select("#chart")
    .append("div")
    .attr("id", "legend");

  d3
    .select(".container-fluid")
    .append("div")
    .attr("id", "nfo");

  const usMapUrl =
        "https://raw.githubusercontent.com/no-stack-dub-sack/testable-projects-fcc/master/src/data/choropleth_map/counties.json",
        eduUrl =
        "https://raw.githubusercontent.com/no-stack-dub-sack/testable-projects-fcc/master/src/data/choropleth_map/for_user_education.json";

  const width = 960;
  const height = 600;
  
  const tooltip = d3
  .select("#chart")
  .append("div")
  .attr("id", "tooltip")
  .style("opacity", 0);

  const svg = d3
  .select("#chart")
  .append("svg")
  .attr("id", "main")
  .attr("width", width)
  .attr("height", height);

  const path = d3.geoPath();

  const urls = [usMapUrl, eduUrl];

  Promise.all(urls.map(url => d3.json(url))).then(dataset => {
    const usMap = dataset[0],
          usEdu = dataset[1];

    //console.log(usMap);
    //console.log(usEdu);
    
    //geting the specific state when hovering over it
    function state(data) {
        const results = usEdu.filter(val => {
          return val.fips === data.id
        });
        if(results.length !== 0) return results[0].state;
        return 0;
      }
    
    //geting the specific county when hovering over it
    function county(data) {
        const results = usEdu.filter(val => {
          return val.fips === data.id
        });
        if(results.length !== 0) return results[0].area_name;
        return 0;
    }
    
    //geting the specific percentage when hovering over it
    function percentage(data) {
        const results = usEdu.filter(val => {
          return val.fips === data.id
        });
        if(results.length !== 0) return results[0].bachelorsOrHigher;
        return 0;
    }

    svg
      .append("g")
      .selectAll("path")
      .data(topojson.feature(usMap, usMap.objects.counties).features)
      .enter()
      .append("path")
      .attr("fill", (d) => (
           percentage(d) < 3 ? "#fff"
         : percentage(d) >= 3 && percentage(d) < 12 ? "#c6eaef"
         : percentage(d) >= 12 && percentage(d) < 21 ? "#9edae1"
         : percentage(d) >= 21 && percentage(d) < 30 ? "#6bcbd6"
         : percentage(d) >= 30 && percentage(d) < 39 ? "#42b8c6"
         : percentage(d) >= 39 && percentage(d) < 48 ? "#20a6b5"
         : percentage(d) >= 48 && percentage(d) < 57 ? "#088d9c"
         : percentage(d) >= 57 && percentage(d) < 66 ? "#08616b"
         : percentage(d) >= 66 && percentage(d) < 75 ? "#065059"
         : percentage(d) >= 75 ? "#000": "None"))
      .attr("class", "county")
      .attr("stroke", "#fff")
      .attr("stroke-width", "0.2px")
      .attr("data-fips", (d) => d.id)
      .attr("data-education", (d) => {
      const results = usEdu.filter(val => {
        return val.fips === d.id
      });
      if(results.length !== 0) return results[0].bachelorsOrHigher;
      return 0;
    })
      .attr("d", path)
      .on("mouseover", (d) => {      
      tooltip
        .transition()
        .duration(50)
        .style("opacity", .8);
      tooltip
        .attr("data-education", percentage(d))
        .html(county(d) +       
        "<br/>" + "State: " +
        "<strong>" + state(d) + "</strong>"+
        "<br/>" + "Percentage: " +
        "<strong>" +  percentage(d) + "%" + "</strong>")
        .style("left", (d3.event.pageX - width / 1.45) + "px")
        .style("top", (d3.event.pageY - height / 4) + "px");	
    })
      .on("mouseout", d => {
      tooltip
        .transition()
        .duration(100)
        .style("opacity", 0);

    /*svg
      .append("path")
      .datum(topojson.mesh(usMap, usMap.objects.states, (a, b) => a !== b))
      .attr("fill", "none")
      .attr("stroke", "#fff")
      .attr("stroke-linejoin", "round")
      .attr("d", path);*/
    });
  });

  //Basic Legend colors chart  
  const legendData = [0, 1, 2, 3, 4, 5, 6, 7, 8];  

  const legend = d3
  .select("#legend")
  .append("svg")
  .attr("id", "sec")
  .attr("width", 60)
  .attr("height", 400);

  legend
    .selectAll("rect")
    .data(legendData)
    .enter()
    .append("rect")
    .attr("class", "legend-cell")
    .attr("y", (d, i) => 40 + i * 31)
    .attr("width", 10)
    .attr("height", 30)
    .attr(
    "fill",
    d =>
    d < 1
    ? "#065059"
    : d >= 1 && d < 2
    ? "#08616b"
    : d >= 2 && d < 3
    ? "#088d9c"
    : d >= 3 && d < 4
    ? "#20a6b5"
    : d >= 4 && d < 5
    ? "#42b8c6"
    : d >= 5 && d < 6
    ? "#6bcbd6"
    : d >= 6 && d < 7
    ? "#9edae1"
    : d >= 7 && d < 8
    ? "#c6eaef"
    : d >= 8 && d < 9
    ? "#fff" : "None"
  );  

  legend
    .append("text")
    .attr("transform", "translate(" + 25 + " ," + 320 + ")")
    .style("text-anchor", "middle")
    .style("fill", "#75aaaa")
    .text("<3%")
    .style("font-size", "11px");

  legend
    .append("text")
    .attr("transform", "translate(" + 25 + " ," + 45 + ")")
    .style("text-anchor", "middle")
    .style("fill", "#75aaaa")
    .text(">77%")
    .style("font-size", "11px");
};
