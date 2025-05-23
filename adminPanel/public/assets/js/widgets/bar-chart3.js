'use strict';
document.addEventListener('DOMContentLoaded', function () {
  setTimeout(function () {
    var options = {
      chart: {
        type: 'bar',
        height: 255,
        toolbar: {
          show: false
        }
      },
      series: [
        {
          name: 'Net Profit',
          data: [40, 70, 30, 60]
        },
        {
          name: 'Revenue',
          data: [20, 40, 20, 45]
        }
      ],
      colors: ['#1de9b6', '#a389d4'],
      fill: {
        type: 'gradient',
        opacity: 1,
        gradient: {
          shade: 'dark',
          type: 'vertical',
          gradientToColors: ['#1dc4e9', '#899ed4'],
          stops: [0, 100]
        }
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '45%'
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        show: true,
        width: 2,
        colors: ['transparent']
      },
      xaxis: {
        categories: ['Q1', 'Q2', 'Q3', 'Q4']
      },
      tooltip: {
        y: {
          formatter: function (val) {
            return '$ ' + val + ' thousands';
          }
        }
      }
    };
    var chart = new ApexCharts(document.querySelector('#bar-chart3'), options);
    chart.render();
  }, 500);
});
