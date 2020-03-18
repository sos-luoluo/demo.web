// 引入公共文件
import '../utils/main'
// UI组件
import { pageLoading, tips, modal, ajaxLoading } from '../utils/components'
// 静态数据
import { regular } from '../utils/constants'
// ajax方法
import { ajax, ListAjax } from '../utils/ajax'
// 字符串模板工具
import juicer from 'juicer'

import * as d3 from "d3";



$(document).ready(() => {
  pageLoading.show()
  bindData().then(bindEvent).then(() => {
    pageLoading.hide()
  }).catch((err) => {
    console.log(err)
  })
})

/**
 * 绑定数据
 */
function bindData() {
  return new Promise((resolve, reject) => {
    resolve()
  })
}

/**
 * 绑定事件
 */
async function bindEvent() {
  let margin = { top: 20, right: 30, bottom: 30, left: 40 }
  let height = 500
  let width = 600
  let data = [
    { date: new Date('2012-1-2'), value: 0.2 },
    { date: new Date('2012-1-3'), value: 0.3 },
    { date: new Date('2012-1-4'), value: 0.4 },
    { date: new Date('2012-1-5'), value: 0.5 },
    { date: new Date('2012-1-6'), value: 0.6 },
    { date: new Date('2012-1-7'), value: 0.7 },
    { date: new Date('2012-1-8'), value: 0.8 },
    { date: new Date('2012-1-9'), value: 0.9 },
    { date: new Date('2012-1-10'), value: 1.2 },
    { date: new Date('2012-1-11'), value: 2.2 },
    { date: new Date('2012-1-12'), value: 3.2 },
    { date: new Date('2012-1-13'), value: 4.2 },
    { date: new Date('2012-1-14'), value: 5.2 },
    { date: new Date('2012-1-15'), value: 6.2 },
    { date: new Date('2012-1-16'), value: 7.2 },
    { date: new Date('2012-1-17'), value: 8.2 },
    { date: new Date('2012-1-18'), value: 9.2 },
    { date: new Date('2012-1-19'), value: 10.2 },
    { date: new Date('2012-1-20'), value: 20.2 },
    { date: new Date('2012-1-21'), value: 30.2 },
    { date: new Date('2012-1-22'), value: 40.2 },
  ]

  let x = d3.scaleUtc()
    .domain(d3.extent(data, d => d.date))
    .range([margin.left, width - margin.right])
  let y = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.value)]).nice()
    .range([height - margin.bottom, margin.top])

  let xAxis = g => g
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(d3.axisBottom(x).ticks(width / 80).tickSizeOuter(0))

  let yAxis = g => g
    .attr("transform", `translate(${margin.left},0)`)
    .call(d3.axisLeft(y))
    .call(g => g.select(".domain").remove())
    .call(g => g.select(".tick:last-of-type text").clone()
      .attr("x", 3)
      .attr("text-anchor", "start")
      .attr("font-weight", "bold")
      .text(data.y));

  let callout = (g, value) => {
    if (!value) return g.style("display", "none");

    g
      .style("display", null)
      .style("pointer-events", "none")
      .style("font", "10px sans-serif");

    const path = g.selectAll("path")
      .data([null])
      .join("path")
      .attr("fill", "white")
      .attr("stroke", "black");

    const text = g.selectAll("text")
      .data([null])
      .join("text")
      .call(text => text
        .selectAll("tspan")
        .data((value + "").split(/\n/))
        .join("tspan")
        .attr("x", 0)
        .attr("y", (d, i) => `${i * 1.1}em`)
        .style("font-weight", (_, i) => i ? null : "bold")
        .text(d => d));

    const { x, y, width: w, height: h } = text.node().getBBox();

    text.attr("transform", `translate(${-w / 2},${15 - y})`);
    path.attr("d", `M${-w / 2 - 10},5H-5l5,-5l5,5H${w / 2 + 10}v${h + 20}h-${w + 20}z`);
  }
  const bisect1 = d3.bisector(d => d.date).left;
  let bisect = (mx) => {
    const date = x.invert(mx);
    const index = bisect1(data, date, 1);
    return index
  }

  let line = d3.line()
    .curve(d3.curveStep)
    .defined(d => !isNaN(d.value))
    .x(d => x(d.date))
    .y(d => y(d.value))

  let dom = document.createElement('svg');
  dom.setAttribute("viewBox", "0,0," + width + "," + height)
  dom.setAttribute("width", width)
  dom.setAttribute("height", height)

  const svg = d3.create("svg")
    .attr("viewBox", [0, 0, width, height])
    .style("-webkit-tap-highlight-color", "transparent")
    .style("overflow", "visible");

  svg.append("g")
    .call(xAxis);

  svg.append("g")
    .call(yAxis);

  svg.append("path")
    .datum(data)
    .attr("fill", "none")
    .attr("stroke", "steelblue")
    .attr("stroke-width", 1.5)
    .attr("stroke-linejoin", "round")
    .attr("stroke-linecap", "round")
    .attr("d", line);

  const tooltip = svg.append("g");

  svg.on("touchmove mousemove", function () {
    console.log(bisect(d3.mouse(this)[0]))
    const { date, value } = bisect(d3.mouse(this)[0]);
    tooltip
      .attr("transform", `translate(${x(date)},${y(value)})`)
      .call(callout, `${value.toLocaleString(undefined, { style: "currency", currency: "USD" })}
${date.toLocaleString(undefined, { month: "short", day: "numeric", year: "numeric" })}`);
  });

  svg.on("touchend mouseleave", () => tooltip.call(callout, null));

  document.body.append(svg.node())


}