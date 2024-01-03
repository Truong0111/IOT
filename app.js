// app.js

const isBrowser = typeof window !== 'undefined';

const fetchData = async () => {
    try {
        const response = await fetch('http://localhost:3000/analytics');
        const data = await response.json();
        if (isBrowser) {
            displayData(data);
        }
    } catch (error) {
        console.error(error);
    }
};

const displayData = (data) => {
    if (!isBrowser) {
        console.error('DisplayData is not supported in a non-browser environment.');
        return;
    }

    const analyticsDataTbody = document.getElementById('analyticsData');

    const statCurrentCountData = document.getElementById('statCurrentCount');

    // Clear existing content
    analyticsDataTbody.innerHTML = '';
    statCurrentCountData.innerHTML = '';

    var currentTotalCount = 0

    // Display data in the table
    if (data == undefined || data == null) {
        statCurrentCountData.innerHTML = `Current total count: 0`;
        return;
    }
    Object.keys(data).forEach(key => {
        const tr = document.createElement('tr');
        
        const cmndTd = document.createElement('td');
        cmndTd.textContent = data[key].cmnd;
        tr.appendChild(cmndTd);

        const licensePlateTd = document.createElement('td');
        licensePlateTd.textContent = data[key].license_plate;
        tr.appendChild(licensePlateTd);

        const entryTimeTd = document.createElement('td');
        entryTimeTd.textContent = data[key].entry_time;
        tr.appendChild(entryTimeTd);

        const exitTimeTd = document.createElement('td');
        exitTimeTd.textContent = data[key].exit_time;
        tr.appendChild(exitTimeTd);

        analyticsDataTbody.appendChild(tr);
        
        currentTotalCount++;
    });

    statCurrentCountData.innerHTML = `Current total count: ${currentTotalCount}`;

};

// Mark fetchData as async
const runFetchData = async () => {
    while (true) {
        await fetchData();
        // Đặt thời gian chờ giữa các lần thực thi
        await new Promise(resolve => setTimeout(resolve, 1000)); // Chờ 1 giây trước khi thực hiện lại
    }
};

if (isBrowser) {
    runFetchData();
}
