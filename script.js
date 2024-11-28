document.addEventListener('DOMContentLoaded', function () {
    const budgetForm = document.getElementById('budget-form');
    const categoriesContainer = document.getElementById('expense-categories');
    const addCategoryBtn = document.getElementById('add-category');
    const newCategoryInput = document.getElementById('new-category');
    const budgetPlanContainer = document.createElement('div'); // Container for budget plan details
    budgetPlanContainer.id = 'budget-plan';
    document.querySelector('main').appendChild(budgetPlanContainer);

    let expenseCategories = [];
    let categoryGroups = {};

    // Function to add a new category
    addCategoryBtn.addEventListener('click', function () {
        const categoryName = newCategoryInput.value.trim();

        if (categoryName && !expenseCategories.includes(categoryName)) {
            expenseCategories.push(categoryName);
            const backgroundColor = expenseCategories.length % 2 === 0 ? '#fab91c' : '#00563f';

            const categoryDiv = document.createElement('div');
            categoryDiv.className = 'category';
            categoryDiv.style.backgroundColor = backgroundColor;

            const label = document.createElement('label');
            label.setAttribute('for', categoryName);
            label.textContent = categoryName;
            label.style.fontSize = '25px';
            label.style.color = '#fff';
            label.style.textShadow = '1px 1px 3px rgba(0, 0, 0, 0.5)';
            categoryDiv.appendChild(label);

            const groupSelect = document.createElement('select');
            groupSelect.id = `${categoryName}-group`;
            groupSelect.name = `${categoryName}-group`;

            const groups = ['Food', 'Transportation', 'School Supplies', 'Others'];
            groups.forEach(group => {
                const option = document.createElement('option');
                option.value = group;
                option.textContent = group;
                groupSelect.appendChild(option);
            });

            categoryDiv.innerHTML += `
                <input type="number" id="${categoryName}" name="${categoryName}" placeholder="Enter amount" required>
                <button type="button" class="remove-category" data-category="${categoryName}">Remove</button>
            `;
            categoryDiv.insertBefore(groupSelect, categoryDiv.lastChild);
            categoriesContainer.appendChild(categoryDiv);

            setTimeout(() => {
                categoryDiv.classList.add('slide-in');
            }, 10);

            newCategoryInput.value = '';
        } else {
            alert('Category name cannot be empty or duplicate!');
        }
    });

    categoriesContainer.addEventListener('click', function (event) {
        if (event.target.classList.contains('remove-category')) {
            const categoryToRemove = event.target.dataset.category;
            expenseCategories = expenseCategories.filter(cat => cat !== categoryToRemove);
            delete categoryGroups[categoryToRemove];
            event.target.parentElement.remove();
        }
    });

    budgetForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const weeklyBudget = parseInt(document.getElementById('weekly-budget').value);
        const data = [];
        const labels = [];
        const groupTotals = { Food: 0, Transportation: 0, 'School Supplies': 0, Others: 0 };

        expenseCategories.forEach(category => {
            const value = parseInt(document.getElementById(category).value);
            const group = document.getElementById(`${category}-group`).value;
            data.push(value);
            labels.push(`${category} (${group})`);
            groupTotals[group] += value;
        });

        const totalSpent = data.reduce((a, b) => a + b, 0);
        const remainingBudget = weeklyBudget - totalSpent;

        if (remainingBudget >= 0) {
            data.push(remainingBudget);
            labels.push('Remaining Budget');
        } else {
            alert('Your expenses exceed your budget!');
            return;
        }
        
        // Display the chart sections after submitting the form
        document.getElementById('budget-chart').style.display = 'flex';
        document.getElementById('expense-breakdown-chart').style.display = 'block';

        // Create the pie chart
        const ctxPie = document.getElementById('myChart').getContext('2d');
        new Chart(ctxPie, {
            type: 'pie',
            data: {
                labels: labels,
                datasets: [{
                    data: data,
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                        'rgba(255, 159, 64, 0.2)'
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { position: 'top' },
                    title: { display: true, text: 'Budget Distribution' }
                }
            }
        });

        // Create the bar chart for percentage breakdown
        const percentages = {
            Food: (groupTotals.Food / weeklyBudget) * 100,
            Transportation: (groupTotals.Transportation / weeklyBudget) * 100,
            'School Supplies': (groupTotals['School Supplies'] / weeklyBudget) * 100,
            Others: (groupTotals.Others / weeklyBudget) * 100
        };

        const ctxBar = document.getElementById('myBarChart').getContext('2d');
        new Chart(ctxBar, {
            type: 'bar',
            data: {
                labels: ['Food', 'Transportation', 'School Supplies', 'Others'],
                datasets: [{
                    label: 'Expense Breakdown (%)',
                    data: [percentages.Food, percentages.Transportation, percentages['School Supplies'], percentages.Others],
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.5)',
                        'rgba(54, 162, 235, 0.5)',
                        'rgba(255, 206, 86, 0.5)',
                        'rgba(75, 192, 192, 0.5)'
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100
                    }
                },
                plugins: {
                    legend: { display: false },
                    title: { display: true, text: 'Expense Category Breakdown by Percentage' }
                }
            }
        });

        // Determine the recommended plan
        const selectedPlan = determinePlan(groupTotals, weeklyBudget);
        budgetPlanContainer.innerHTML = `<h3>Selected Plan: ${selectedPlan.planName}</h3><p>${selectedPlan.description}</p>`;
    });

    function determinePlan(totals, budget) {
        const percentages = {
            Food: (totals.Food / budget) * 100,
            Transportation: (totals.Transportation / budget) * 100,
            'School Supplies': (totals['School Supplies'] / budget) * 100,
            Others: (totals.Others / budget) * 100
        };

        if (
            percentages.Food <= 40 &&
            percentages.Transportation <= 30 &&
            percentages['School Supplies'] <= 10 &&
            percentages.Others <= 20
        ) {
            return {
                planName: 'Basic Needs Budget',
                description: 'Focuses on essential spending for necessities like food and transport.'
            };
        } else if (
            percentages.Food <= 35 &&
            percentages.Transportation <= 25 &&
            percentages['School Supplies'] <= 15 &&
            percentages.Others <= 25
        ) {
            return {
                planName: 'Balanced Living Budget',
                description: 'Balances essentials with savings and social activities.'
            };
        } else {
            return {
                planName: 'Flexible Comfort Budget',
                description: 'Allows flexibility for comfort and quality of life.'
            };
        }
    }
});
