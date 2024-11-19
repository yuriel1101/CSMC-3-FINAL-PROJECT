document.addEventListener("DOMContentLoaded", () => {
    const selectElement = document.querySelector("select");
    const shopContainers = document.querySelectorAll(".small-container .row"); // Select all rows

    selectElement.addEventListener("change", (event) => {
        const criterion = event.target.value;

        shopContainers.forEach(shopContainer => {
            const shops = Array.from(shopContainer.querySelectorAll(".col-4"));

            // Sorting logic
            const sortedShops = [...shops].sort((a, b) => {
                switch (criterion) {
                    case "Sort by Budget":
                        return parseFloat(a.dataset.budget) - parseFloat(b.dataset.budget); // Ascending by budget
                    case "Sort by Location":
                        return a.dataset.location.localeCompare(b.dataset.location); // Alphabetical by location
                    case "Sort by Popularity":
                        // Ensure we parse the popularity correctly as numbers
                        const popularityA = parseInt(a.dataset.popularity);
                        const popularityB = parseInt(b.dataset.popularity);
                        return popularityB - popularityA; // Descending by popularity
                    case "Sort by Ratings":
                        return parseFloat(b.dataset.rating) - parseFloat(a.dataset.rating); // Descending by rating
                    default:
                        return 0; // Default sorting (no change)
                }
            });

            // Debugging output to verify the sort
            console.log("Sorted Shops:", sortedShops.map(shop => {
                return {
                    shop: shop.querySelector('h4').textContent,
                    popularity: shop.dataset.popularity
                };
            }));

            // Clear and append sorted shops
            shopContainer.innerHTML = ""; // Clear the current container
            sortedShops.forEach((shop) => shopContainer.appendChild(shop)); // Append sorted shops
        });
    });
});
