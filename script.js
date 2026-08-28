
document.addEventListener("DOMContentLoaded", function () {

    const predictButton = document.querySelector(".predict-button");
    const resultBox = document.querySelector(".result-placeholder");

    predictButton.addEventListener("click", async function () {

        const inputs = document.querySelectorAll(".input-group input");

        const data = {
            op_unique_carrier: inputs[0].value,
            origin: inputs[1].value,
            dest: inputs[2].value,
            distance: Number(inputs[3].value),
            crs_dep_time: Number(inputs[4].value),
            crs_arr_time: Number(inputs[5].value),

            op_carrier_fl_num: 1,
            cancelled: 0,
            diverted: 0,
            crs_elapsed_time: 120,

            flight_year: new Date().getFullYear(),
            flight_month: new Date().getMonth() + 1,
            flight_day: new Date().getDate(),
            flight_dayofweek: new Date().getDay()
        };

        resultBox.innerHTML = `
            <span>Prediction Result</span>
            <strong>Analyzing flight data...</strong>
        `;

        try {

            const response = await fetch("/predict", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (result.error) {

                resultBox.innerHTML = `
                    <span>Prediction Error</span>
                    <strong>${result.error}</strong>
                `;

                return;
            }

            resultBox.innerHTML = `
                <span>Prediction Result</span>
                <strong>${result.prediction}</strong>
                <small>
                    Delay probability: ${result.probability}%
                </small>
            `;

        } catch (error) {

            resultBox.innerHTML = `
                <span>Connection Error</span>
                <strong>Unable to connect to the ML server.</strong>
            `;
        }

    });

});
