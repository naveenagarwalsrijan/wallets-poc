/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
    var dataset = [
        {
            "label" : "KO",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "OK",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9481666666666667, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.9485, 500, 1500, "Deduct wallet money 29"], "isController": false}, {"data": [0.9478333333333333, 500, 1500, "Deduct wallet money 28"], "isController": false}, {"data": [0.9478333333333333, 500, 1500, "Deduct wallet money 30"], "isController": false}, {"data": [0.9486666666666667, 500, 1500, "Deduct wallet money 23"], "isController": false}, {"data": [0.9468333333333333, 500, 1500, "Deduct wallet money 22"], "isController": false}, {"data": [0.9493333333333334, 500, 1500, "Deduct wallet money 21"], "isController": false}, {"data": [0.9483333333333334, 500, 1500, "Deduct wallet money 27"], "isController": false}, {"data": [0.9475, 500, 1500, "Deduct wallet money 26"], "isController": false}, {"data": [0.9485, 500, 1500, "Deduct wallet money 25"], "isController": false}, {"data": [0.9483333333333334, 500, 1500, "Deduct wallet money 24"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 30000, 0, 0.0, 244.31633333333315, 2, 2043, 158.0, 455.0, 1160.0, 1582.9900000000016, 2471.7805058910767, 550.3573782648101, 506.90811155969345], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions\/s", "Received", "Sent"], "items": [{"data": ["Deduct wallet money 29", 3000, 0, 0.0, 243.7859999999997, 3, 1970, 154.0, 419.9000000000001, 1114.699999999999, 1547.9799999999996, 247.1780505891077, 55.035737826481004, 50.69081115596935], "isController": false}, {"data": ["Deduct wallet money 28", 3000, 0, 0.0, 244.96333333333325, 3, 2002, 154.0, 420.9000000000001, 1100.0, 1546.9599999999991, 247.1780505891077, 55.035737826481004, 50.69081115596935], "isController": false}, {"data": ["Deduct wallet money 30", 3000, 0, 0.0, 244.66533333333362, 4, 1953, 154.0, 420.0, 1122.7999999999993, 1513.9299999999985, 247.1780505891077, 55.035737826481004, 50.69081115596935], "isController": false}, {"data": ["Deduct wallet money 23", 3000, 0, 0.0, 242.0519999999998, 3, 1997, 154.0, 407.7000000000003, 1108.7999999999993, 1524.9799999999996, 247.1780505891077, 55.035737826481004, 50.69081115596935], "isController": false}, {"data": ["Deduct wallet money 22", 3000, 0, 0.0, 241.51533333333361, 3, 1904, 155.0, 419.8000000000002, 1094.9499999999998, 1546.9699999999993, 247.19841793012526, 55.04027274225445, 50.69498805207647], "isController": false}, {"data": ["Deduct wallet money 21", 3000, 0, 0.0, 243.59800000000004, 2, 1964, 154.0, 403.0, 1099.749999999999, 1513.9599999999991, 247.19841793012526, 55.04027274225445, 50.69498805207647], "isController": false}, {"data": ["Deduct wallet money 27", 3000, 0, 0.0, 246.60199999999995, 3, 2043, 158.0, 418.0, 1108.8499999999995, 1530.9199999999983, 247.19841793012526, 55.04027274225445, 50.69498805207647], "isController": false}, {"data": ["Deduct wallet money 26", 3000, 0, 0.0, 244.35833333333298, 3, 1947, 155.0, 410.9000000000001, 1109.8999999999996, 1536.8399999999965, 247.21878862793574, 55.044808405438815, 50.69916563658838], "isController": false}, {"data": ["Deduct wallet money 25", 3000, 0, 0.0, 248.35733333333343, 3, 2003, 163.0, 408.8000000000002, 1101.7999999999993, 1507.9599999999991, 247.1780505891077, 55.035737826481004, 50.69081115596935], "isController": false}, {"data": ["Deduct wallet money 24", 3000, 0, 0.0, 243.26566666666687, 3, 2027, 156.0, 409.9000000000001, 1103.0, 1516.0, 247.3003050037095, 55.06295853598219, 50.71588286208886], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 30000, 0, null, null, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
