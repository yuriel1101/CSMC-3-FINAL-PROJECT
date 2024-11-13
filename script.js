document.getElementById('budget-form').addEventListener('submit', function(event) {
    event.preventDefault();

    // Get the weekly budget and costs
    const weeklyBudget = parseInt(document.getElementById('weekly-budget').value);
    const food = parseInt(document.getElementById('food').value);
    const transport = parseInt(document.getElementById('transport').value);
    const entertainment = parseInt(document.getElementById('entertainment').value);
    const bills = parseInt(document.getElementById('bills').value);

    // Prepare data for the chart
    const data = [food, transport, entertainment, bills];
    const totalSpent = data.reduce((a, b) => a + b, 0);
    const remainingBudget = weeklyBudget - totalSpent;

    // Update the chart
    const ctx = document.getElementById('myChart').getContext('2d');
    const myChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Food', 'Transport', 'Entertainment', 'Bills', 'Remaining Budget'],
            datasets: [{
                label: 'Budget Distribution',
                data: [...data, remainingBudget], // Add remaining budget
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)' // Color for remaining budget
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: false, // Disable responsive to keep fixed size
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: 'Budget Distribution'
                }
            }
        }
    });
});
